import { create } from 'zustand';
import {
  Product,
  Distributor,
  Warehouse,
  Route,
  ChangeRequest,
  DemandForecast,
  SourcePlan,
  Metrics,
  Alert,
  DistributorInventory,
  WarehouseInventory,
  OrderItem,
  RequestedChange,
  InterpretedRequest,
  SourceAllocation
} from '../types/distribution';

interface DistributionOOSStore {
  // Data
  products: Product[];
  distributors: Distributor[];
  warehouses: Warehouse[];
  routes: Route[];
  changeRequests: ChangeRequest[];
  demandForecasts: DemandForecast[];
  sourcePlans: SourcePlan[];
  alerts: Alert[];
  metrics: Metrics;
  
  // Loading states
  isLoadingRequests: boolean;
  isAnalyzingRequest: boolean;
  isGeneratingPlan: boolean;
  isOptimizingRoutes: boolean;
  
  // Actions
  fetchInitialData: () => void;
  submitChangeRequest: (request: Omit<ChangeRequest, 'id' | 'requestDate' | 'status'>) => void;
  analyzeRequest: (requestId: string) => Promise<void>;
  generateSourcePlan: (requestId: string) => Promise<void>;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  updateMetrics: () => void;
  optimizeRoutes: () => Promise<void>;
  validateAndProcessRequest: (requestText: string, distributorId: string) => Promise<string>;
  runFullAnalysis: (requestId: string) => Promise<void>;
}

export const useDistributionOOSStore = create<DistributionOOSStore>((set, get) => ({
  // Initial data
  products: [
    {
      id: 'p1',
      name: 'Premium Lager 500ml',
      category: 'beer',
      sku: 'BL-500-001',
      volume: 0.5,
      alcoholContent: 5.0,
      unitCost: 2.50,
      shelfLife: 180
    },
    {
      id: 'p2',
      name: 'Craft IPA 330ml',
      category: 'beer',
      sku: 'BI-330-002',
      volume: 0.33,
      alcoholContent: 6.2,
      unitCost: 3.20,
      shelfLife: 120
    },
    {
      id: 'p3',
      name: 'Red Wine 750ml',
      category: 'wine',
      sku: 'WR-750-003',
      volume: 0.75,
      alcoholContent: 13.5,
      unitCost: 15.00,
      shelfLife: 1095
    },
    {
      id: 'p4',
      name: 'Premium Vodka 700ml',
      category: 'spirits',
      sku: 'SV-700-004',
      volume: 0.7,
      alcoholContent: 40.0,
      unitCost: 25.00,
      shelfLife: 3650
    },
    {
      id: 'p5',
      name: 'RTD Cocktail 275ml',
      category: 'rtd',
      sku: 'RC-275-005',
      volume: 0.275,
      alcoholContent: 5.5,
      unitCost: 4.50,
      shelfLife: 365
    },
    {
      id: 'p6',
      name: 'Light Beer 355ml',
      category: 'beer',
      sku: 'BL-355-006',
      volume: 0.355,
      alcoholContent: 3.8,
      unitCost: 2.10,
      shelfLife: 150
    }
  ],

  distributors: [
    {
      id: 'd1',
      name: 'Bay Area Premium Beverages',
      location: {
        address: '1555 Third Street',
        city: 'San Francisco',
        state: 'CA',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      capacity: 50000,
      currentInventory: [
        { productId: 'p1', currentStock: 850, reservedStock: 200, lastUpdated: new Date(), reorderPoint: 1000, maxStock: 5000 },
        { productId: 'p2', currentStock: 320, reservedStock: 80, lastUpdated: new Date(), reorderPoint: 500, maxStock: 3000 },
        { productId: 'p3', currentStock: 150, reservedStock: 50, lastUpdated: new Date(), reorderPoint: 200, maxStock: 1000 }
      ],
      creditLimit: 500000,
      paymentTerms: 'Net 30',
      deliveryWindow: {
        preferredDays: ['Tuesday', 'Thursday'],
        timeSlot: '8:00-12:00'
      },
      salesHistory: []
    },
    {
      id: 'd2',
      name: 'Golden Gate Distribution',
      location: {
        address: '2800 Alameda Street',
        city: 'San Francisco',
        state: 'CA',
        coordinates: { lat: 37.7849, lng: -122.4094 }
      },
      capacity: 35000,
      currentInventory: [
        { productId: 'p1', currentStock: 1200, reservedStock: 300, lastUpdated: new Date(), reorderPoint: 800, maxStock: 4000 },
        { productId: 'p4', currentStock: 180, reservedStock: 20, lastUpdated: new Date(), reorderPoint: 150, maxStock: 800 },
        { productId: 'p5', currentStock: 650, reservedStock: 150, lastUpdated: new Date(), reorderPoint: 500, maxStock: 2500 }
      ],
      creditLimit: 350000,
      paymentTerms: 'Net 45',
      deliveryWindow: {
        preferredDays: ['Monday', 'Wednesday', 'Friday'],
        timeSlot: '6:00-10:00'
      },
      salesHistory: []
    },
    {
      id: 'd3',
      name: 'Silicon Valley Spirits Co',
      location: {
        address: '1234 Mission Street',
        city: 'San Francisco',
        state: 'CA',
        coordinates: { lat: 37.7649, lng: -122.4194 }
      },
      capacity: 28000,
      currentInventory: [
        { productId: 'p2', currentStock: 450, reservedStock: 100, lastUpdated: new Date(), reorderPoint: 600, maxStock: 2500 },
        { productId: 'p3', currentStock: 220, reservedStock: 30, lastUpdated: new Date(), reorderPoint: 300, maxStock: 1200 },
        { productId: 'p6', currentStock: 180, reservedStock: 50, lastUpdated: new Date(), reorderPoint: 400, maxStock: 2000 }
      ],
      creditLimit: 280000,
      paymentTerms: 'Net 30',
      deliveryWindow: {
        preferredDays: ['Tuesday', 'Thursday', 'Saturday'],
        timeSlot: '9:00-15:00'
      },
      salesHistory: []
    },
    {
      id: 'd4',
      name: 'North Bay Wine & Spirits',
      location: {
        address: '750 Harrison Street',
        city: 'San Francisco',
        state: 'CA',
        coordinates: { lat: 37.7849, lng: -122.3994 }
      },
      capacity: 32000,
      currentInventory: [
        { productId: 'p3', currentStock: 380, reservedStock: 70, lastUpdated: new Date(), reorderPoint: 400, maxStock: 1500 },
        { productId: 'p4', currentStock: 290, reservedStock: 40, lastUpdated: new Date(), reorderPoint: 250, maxStock: 1200 },
        { productId: 'p1', currentStock: 1100, reservedStock: 200, lastUpdated: new Date(), reorderPoint: 900, maxStock: 4500 }
      ],
      creditLimit: 420000,
      paymentTerms: 'Net 30',
      deliveryWindow: {
        preferredDays: ['Monday', 'Wednesday', 'Friday'],
        timeSlot: '10:00-14:00'
      },
      salesHistory: []
    }
  ],

  warehouses: [
    {
      id: 'w1',
      name: 'Petaluma Production Facility',
      location: {
        address: '2500 Industrial Ave',
        city: 'Petaluma',
        state: 'CA',
        coordinates: { lat: 38.2325, lng: -122.6367 }
      },
      type: 'factory',
      capacity: 200000,
      currentInventory: [
        { productId: 'p1', availableStock: 15000, inTransitStock: 2000, reservedStock: 1000, lastRestocked: new Date(), productionSchedule: [new Date(), new Date(Date.now() + 86400000)] },
        { productId: 'p2', availableStock: 8500, inTransitStock: 500, reservedStock: 800, lastRestocked: new Date(), productionSchedule: [new Date(Date.now() + 172800000)] },
        { productId: 'p6', availableStock: 12000, inTransitStock: 800, reservedStock: 600, lastRestocked: new Date() }
      ],
      operatingHours: { start: '06:00', end: '22:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      shippingCapabilities: ['standard', 'expedited', 'temperature-controlled']
    },
    {
      id: 'w2',
      name: 'Oakland Distribution Center',
      location: {
        address: '1200 Maritime Street',
        city: 'Oakland',
        state: 'CA',
        coordinates: { lat: 37.8044, lng: -122.2712 }
      },
      type: 'distribution_center',
      capacity: 80000,
      currentInventory: [
        { productId: 'p3', availableStock: 3200, inTransitStock: 400, reservedStock: 200, lastRestocked: new Date() },
        { productId: 'p4', availableStock: 1800, inTransitStock: 150, reservedStock: 100, lastRestocked: new Date() },
        { productId: 'p5', availableStock: 4500, inTransitStock: 300, reservedStock: 250, lastRestocked: new Date() }
      ],
      operatingHours: { start: '05:00', end: '20:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      shippingCapabilities: ['standard', 'expedited']
    },
    {
      id: 'w3',
      name: 'Sacramento Regional Hub',
      location: {
        address: '4200 Power Inn Road',
        city: 'Sacramento',
        state: 'CA',
        coordinates: { lat: 38.5816, lng: -121.4944 }
      },
      type: 'regional_warehouse',
      capacity: 60000,
      currentInventory: [
        { productId: 'p1', availableStock: 4200, inTransitStock: 600, reservedStock: 300, lastRestocked: new Date() },
        { productId: 'p2', availableStock: 2800, inTransitStock: 200, reservedStock: 150, lastRestocked: new Date() },
        { productId: 'p3', availableStock: 1500, inTransitStock: 100, reservedStock: 80, lastRestocked: new Date() }
      ],
      operatingHours: { start: '06:00', end: '18:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      shippingCapabilities: ['standard']
    },
    {
      id: 'w4',
      name: 'San Jose Wine Storage',
      location: {
        address: '890 Coleman Avenue',
        city: 'San Jose',
        state: 'CA',
        coordinates: { lat: 37.3382, lng: -121.8863 }
      },
      type: 'regional_warehouse',
      capacity: 45000,
      currentInventory: [
        { productId: 'p3', availableStock: 2200, inTransitStock: 200, reservedStock: 150, lastRestocked: new Date() },
        { productId: 'p4', availableStock: 1200, inTransitStock: 100, reservedStock: 80, lastRestocked: new Date() },
        { productId: 'p1', availableStock: 3800, inTransitStock: 400, reservedStock: 200, lastRestocked: new Date() }
      ],
      operatingHours: { start: '07:00', end: '19:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      shippingCapabilities: ['standard', 'temperature-controlled']
    }
  ],

  routes: [
    {
      id: 'r1',
      fromWarehouseId: 'w1',
      toDistributorId: 'd1',
      distance: 75,
      estimatedTime: 1.5,
      cost: 850,
      capacity: 5000,
      frequency: 'weekly',
      reliability: 98,
      restrictions: []
    },
    {
      id: 'r2',
      fromWarehouseId: 'w2',
      toDistributorId: 'd2',
      distance: 25,
      estimatedTime: 0.8,
      cost: 450,
      capacity: 3500,
      frequency: 'biweekly',
      reliability: 96,
      restrictions: ['temperature controlled']
    },
    {
      id: 'r3',
      fromWarehouseId: 'w3',
      toDistributorId: 'd3',
      distance: 120,
      estimatedTime: 2.2,
      cost: 980,
      capacity: 4000,
      frequency: 'weekly',
      reliability: 94,
      restrictions: []
    },
    {
      id: 'r4',
      fromWarehouseId: 'w4',
      toDistributorId: 'd4',
      distance: 45,
      estimatedTime: 1.1,
      cost: 620,
      capacity: 3200,
      frequency: 'weekly',
      reliability: 97,
      restrictions: ['temperature controlled']
    },
    {
      id: 'r5',
      fromWarehouseId: 'w1',
      toDistributorId: 'd2',
      distance: 85,
      estimatedTime: 1.8,
      cost: 920,
      capacity: 4500,
      frequency: 'weekly',
      reliability: 95,
      restrictions: []
    },
    {
      id: 'r6',
      fromWarehouseId: 'w2',
      toDistributorId: 'd3',
      distance: 35,
      estimatedTime: 0.9,
      cost: 520,
      capacity: 3800,
      frequency: 'biweekly',
      reliability: 97,
      restrictions: []
    }
  ],

  changeRequests: [
    {
      id: 'cr1',
      distributorId: 'd1',
      requestDate: new Date(),
      originalOrder: [
        { productId: 'p1', quantity: 1000, unitPrice: 2.50, scheduledDelivery: new Date(Date.now() + 86400000) }
      ],
      requestedChanges: [
        {
          type: 'increase',
          productId: 'p1',
          fromQuantity: 1000,
          toQuantity: 1500,
          reason: 'Giants game at Oracle Park this weekend - expecting high demand'
        }
      ],
      requestText: 'Hi team, we need to increase our Premium Lager order from 1000 to 1500 units due to a major Giants game at Oracle Park this weekend. All the sports bars in SOMA are expecting huge crowds. Can you accommodate this change?',
      interpretedRequest: {
        confidence: 0.95,
        extractedChanges: [{
          type: 'increase',
          productId: 'p1',
          fromQuantity: 1000,
          toQuantity: 1500,
          reason: 'Giants game at Oracle Park this weekend - expecting high demand'
        }],
        urgencyLevel: 'high',
        businessReason: 'Giants game driving increased demand in SOMA area',
        estimatedImpact: { revenue: 1250, volume: 500, customerSatisfaction: 0.85 },
        keyTerms: ['increase', 'Giants game', 'Oracle Park', 'sports bars', 'SOMA']
      },
      priority: 'high',
      status: 'approved',
      deadline: new Date(Date.now() + 43200000), // 12 hours
      reason: 'Giants game demand spike',
      requestSource: 'email'
    },
    {
      id: 'cr2',
      distributorId: 'd2',
      requestDate: new Date(Date.now() - 3600000),
      originalOrder: [
        { productId: 'p5', quantity: 800, unitPrice: 4.50, scheduledDelivery: new Date(Date.now() + 172800000) }
      ],
      requestedChanges: [
        {
          type: 'substitute',
          productId: 'p5',
          fromQuantity: 800,
          toQuantity: 800,
          alternativeProductId: 'p1',
          reason: 'Quality concerns with RTD batch reported by Fishermans Wharf restaurants'
        }
      ],
      requestText: 'URGENT: We need to substitute our RTD Cocktail order (800 units) with Premium Lager due to quality issues reported by customers at Fishermans Wharf restaurants. Same quantity needed ASAP.',
      interpretedRequest: {
        confidence: 0.92,
        extractedChanges: [{
          type: 'substitute',
          productId: 'p5',
          fromQuantity: 800,
          toQuantity: 800,
          alternativeProductId: 'p1',
          reason: 'Quality concerns with RTD batch reported by Fishermans Wharf restaurants'
        }],
        urgencyLevel: 'critical',
        businessReason: 'Quality control issue at tourist location',
        estimatedImpact: { revenue: -1600, volume: 0, customerSatisfaction: 0.95 },
        keyTerms: ['URGENT', 'substitute', 'quality issues', 'Fishermans Wharf', 'restaurants']
      },
      priority: 'critical',
      status: 'pending',
      deadline: new Date(Date.now() + 21600000), // 6 hours
      reason: 'Quality control emergency',
      requestSource: 'servicenow'
    },
    {
      id: 'cr3',
      distributorId: 'd3',
      requestDate: new Date(Date.now() - 7200000),
      originalOrder: [
        { productId: 'p2', quantity: 600, unitPrice: 3.20, scheduledDelivery: new Date(Date.now() + 259200000) }
      ],
      requestedChanges: [
        {
          type: 'increase',
          productId: 'p2',
          fromQuantity: 600,
          toQuantity: 900,
          reason: 'Tech conference at Moscone Center - craft beer demand surge expected'
        }
      ],
      requestText: 'Hello, we have a big tech conference at Moscone Center next week and all the Mission District craft beer bars are requesting more IPA inventory. Can we increase our Craft IPA order from 600 to 900 units?',
      interpretedRequest: {
        confidence: 0.88,
        extractedChanges: [{
          type: 'increase',
          productId: 'p2',
          fromQuantity: 600,
          toQuantity: 900,
          reason: 'Tech conference at Moscone Center - craft beer demand surge expected'
        }],
        urgencyLevel: 'medium',
        businessReason: 'Tech conference driving craft beer demand in Mission District',
        estimatedImpact: { revenue: 960, volume: 300, customerSatisfaction: 0.80 },
        keyTerms: ['tech conference', 'Moscone Center', 'Mission District', 'craft beer', 'IPA']
      },
      priority: 'medium',
      status: 'pending',
      deadline: new Date(Date.now() + 86400000), // 24 hours
      reason: 'Conference-driven demand',
      requestSource: 'email'
    },
    {
      id: 'cr4',
      distributorId: 'd1',
      requestDate: new Date(Date.now() - 1800000), // 30 minutes ago
      originalOrder: [
        { productId: 'p1', quantity: 300, unitPrice: 2.75, scheduledDelivery: new Date(Date.now() + 86400000) }
      ],
      requestedChanges: [
        {
          type: 'increase',
          productId: 'p1',
          fromQuantity: 300,
          toQuantity: 450,
          reason: 'Local brewery tour groups confirmed for weekend'
        }
      ],
      requestText: 'Hi team, we need to increase our Premium Lager order from 300 to 450 units. We have confirmed brewery tour groups coming this weekend and expect higher demand.',
      interpretedRequest: {
        confidence: 0.88,
        extractedChanges: [{
          type: 'increase',
          productId: 'p1',
          fromQuantity: 300,
          toQuantity: 450,
          reason: 'Local brewery tour groups confirmed for weekend'
        }],
        urgencyLevel: 'medium',
        businessReason: 'Increased demand from brewery tours',
        estimatedImpact: { revenue: 412.5, volume: 150, customerSatisfaction: 0.85 },
        keyTerms: ['increase', 'Premium Lager', 'brewery tour', 'weekend', 'demand']
      },
      priority: 'medium',
      status: 'analyzing',
      deadline: new Date(Date.now() + 64800000), // 18 hours
      reason: 'Weekend demand spike expected',
      requestSource: 'email'
    }
  ],

  demandForecasts: [
    {
      distributorId: 'd1',
      productId: 'p1',
      forecastDate: new Date(Date.now() + 604800000), // 1 week
      predictedDemand: 1200,
      confidence: 0.87,
      factors: [
        { type: 'seasonal', impact: 0.15, description: 'Summer season increase', confidence: 0.9 },
        { type: 'event', impact: 0.25, description: 'Local sports events', confidence: 0.8 }
      ],
      historicalAccuracy: 0.84,
      seasonalTrend: 'increasing'
    }
  ],

  sourcePlans: [
    {
      requestId: 'cr1',
      approved: true,
      sources: [
        {
          warehouseId: 'w1',
          productId: 'p1',
          quantity: 500,
          routeId: 'r1',
          cost: 850,
          estimatedDelivery: new Date('2025-07-29T14:00:00')
        }
      ],
      totalCost: 850,
      deliveryDate: new Date('2025-07-29T14:00:00'),
      riskAssessment: {
        level: 'low',
        factors: ['Sufficient inventory at Petaluma facility', 'Reliable route to SF', 'Giants game confirmed attendance 40,000+']
      },
      alternatives: [
        {
          description: 'Split delivery from Oakland DC + Petaluma',
          sources: [
            {
              warehouseId: 'w1',
              productId: 'p1',
              quantity: 300,
              routeId: 'r1',
              cost: 510,
              estimatedDelivery: new Date('2025-07-29T14:00:00')
            },
            {
              warehouseId: 'w2',
              productId: 'p1',
              quantity: 200,
              routeId: 'r5',
              cost: 368,
              estimatedDelivery: new Date('2025-07-29T14:00:00')
            }
          ],
          cost: 878,
          deliveryDate: new Date('2025-07-29T14:00:00'),
          pros: ['Load balancing', 'Reduced single-point risk'],
          cons: ['Slightly higher cost', 'Two delivery trucks needed']
        }
      ]
    },
    // Removed initial rejected source plan for cr2 to allow correct approval workflow
  ],

  alerts: [
    {
      id: 'a1',
      type: 'inventory_low',
      severity: 'warning',
      message: 'Bay Area Premium Beverages: Premium Lager stock below reorder point (850 units) - Giants home series this week',
      entityId: 'd1',
      timestamp: new Date(),
      resolved: false,
      actions: ['Increase next delivery', 'Contact distributor', 'Review Giants schedule impact']
    },
    {
      id: 'a2',
      type: 'demand_spike',
      severity: 'critical',
      message: 'Golden Gate Distribution: RTD Cocktail demand 40% above forecast - Fishermans Wharf tourism surge',
      entityId: 'd2',
      timestamp: new Date(Date.now() - 1800000),
      resolved: false,
      actions: ['Analyze tourist patterns', 'Expedite shipment', 'Update forecast model']
    },
    {
      id: 'a3',
      type: 'route_disruption',
      severity: 'warning',
      message: 'Oakland to SF route experiencing delays due to Bay Bridge construction - expect 30min additional transit time',
      entityId: 'r2',
      timestamp: new Date(Date.now() - 3600000),
      resolved: false,
      actions: ['Use alternate route via San Rafael Bridge', 'Notify distributors', 'Update delivery ETA']
    },
    {
      id: 'a4',
      type: 'credit_limit',
      severity: 'info',
      message: 'Silicon Valley Spirits Co approaching credit limit (78% utilized) - review payment terms',
      entityId: 'd3',
      timestamp: new Date(Date.now() - 7200000),
      resolved: false,
      actions: ['Contact accounts receivable', 'Review payment history', 'Consider credit extension']
    }
  ],

  metrics: {
    totalRequests: 3,
    approvedRequests: 1,
    rejectedRequests: 0,
    averageResponseTime: 1.8,
    fulfillmentRate: 96.4,
    costOptimization: 18.5,
    customerSatisfaction: 91.2,
    inventoryTurnover: 9.1,
    routeEfficiency: 94.7
  },

  isLoadingRequests: false,
  isAnalyzingRequest: false,
  isGeneratingPlan: false,
  isOptimizingRoutes: false,

  // Actions
  fetchInitialData: () => {
    // Mock data is already loaded
    set({ isLoadingRequests: false });
  },

  submitChangeRequest: (request) => {
    const newRequest: ChangeRequest = {
      ...request,
      id: `cr${Date.now()}`,
      requestDate: new Date(),
      status: 'pending'
    };
    
    set((state) => ({
      changeRequests: [...state.changeRequests, newRequest],
      metrics: {
        ...state.metrics,
        totalRequests: state.metrics.totalRequests + 1
      }
    }));
  },

  analyzeRequest: async (requestId) => {
    set({ isAnalyzingRequest: true });
    
    // Simulate LLM analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    set((state) => ({
      changeRequests: state.changeRequests.map(req =>
        req.id === requestId ? { ...req, status: 'analyzing' } : req
      ),
      isAnalyzingRequest: false
    }));
  },

  generateSourcePlan: async (requestId) => {
    set({ isGeneratingPlan: true });
    
    // Simulate planning algorithm
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const request = get().changeRequests.find(r => r.id === requestId);
    if (request) {
      const newPlan: SourcePlan = {
        requestId,
        approved: true,
        sources: [
          {
            warehouseId: 'w1',
            productId: request.requestedChanges[0].productId,
            quantity: request.requestedChanges[0].toQuantity - request.requestedChanges[0].fromQuantity,
            routeId: 'r1',
            cost: 1200,
            estimatedDelivery: new Date(Date.now() + 86400000)
          }
        ],
        totalCost: 1200,
        deliveryDate: new Date(Date.now() + 86400000),
        riskAssessment: {
          level: 'low',
          factors: ['Sufficient inventory available', 'Reliable route']
        },
        alternatives: []
      };

      set((state) => ({
        sourcePlans: [...state.sourcePlans, newPlan],
        changeRequests: state.changeRequests.map(req =>
          req.id === requestId ? { ...req, status: 'approved' } : req
        ),
        isGeneratingPlan: false
      }));
    }
  },

  approveRequest: (requestId) => {
    set((state) => {
      // Update request status
      const updatedChangeRequests = state.changeRequests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as 'approved' } : req
      );

      // Find the request and generate a new approved source plan
      const request = state.changeRequests.find(r => r.id === requestId);
      let updatedSourcePlans = state.sourcePlans;
      if (request) {
        const requestedChange = request.requestedChanges[0];
        // Find a warehouse with enough stock, fallback to first
        const relevantWarehouses = state.warehouses.filter(w =>
          w.currentInventory.some(inv => inv.productId === requestedChange.productId)
        );
        const optimalWarehouse = relevantWarehouses.find(w =>
          w.currentInventory.find(inv => inv.productId === requestedChange.productId && inv.availableStock >= (requestedChange.toQuantity - requestedChange.fromQuantity))
        ) || relevantWarehouses[0];
        const route = state.routes.find(r =>
          r.fromWarehouseId === optimalWarehouse.id && r.toDistributorId === request.distributorId
        ) || state.routes[0];
        const newSourcePlan: SourcePlan = {
          requestId,
          approved: true,
          sources: [{
            warehouseId: optimalWarehouse.id,
            productId: requestedChange.productId,
            quantity: requestedChange.toQuantity - requestedChange.fromQuantity,
            routeId: route.id,
            cost: route.cost,
            estimatedDelivery: new Date(Date.now() + (route.estimatedTime * 3600000))
          }],
          totalCost: route.cost,
          deliveryDate: new Date(Date.now() + (route.estimatedTime * 3600000)),
          riskAssessment: {
            level: 'low',
            factors: ['Manual approval']
          },
          alternatives: []
        };
        // Remove any previous source plan for this request and add the new one
        updatedSourcePlans = [
          ...state.sourcePlans.filter(sp => sp.requestId !== requestId),
          newSourcePlan
        ];
      }

      return {
        changeRequests: updatedChangeRequests,
        sourcePlans: updatedSourcePlans,
        metrics: {
          ...state.metrics,
          approvedRequests: state.metrics.approvedRequests + 1
        }
      };
    });
  },

  rejectRequest: (requestId, reason) => {
    set((state) => ({
      changeRequests: state.changeRequests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ),
      metrics: {
        ...state.metrics,
        rejectedRequests: state.metrics.rejectedRequests + 1
      }
    }));
  },

  updateMetrics: () => {
    const state = get();
    const totalRequests = state.changeRequests.length;
    const approvedRequests = state.changeRequests.filter(r => r.status === 'approved').length;
    const rejectedRequests = state.changeRequests.filter(r => r.status === 'rejected').length;
    
    set({
      metrics: {
        ...state.metrics,
        totalRequests,
        approvedRequests,
        rejectedRequests,
        fulfillmentRate: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0
      }
    });
  },

  optimizeRoutes: async () => {
    set({ isOptimizingRoutes: true });
    
    // Simulate route optimization algorithm
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update routes with optimized metrics
    set((state) => ({
      routes: state.routes.map(route => ({
        ...route,
        cost: Math.max(route.cost * 0.85, route.cost - 200), // Optimize cost by 15% or $200 min
        reliability: Math.min(route.reliability + 2, 99), // Improve reliability
        estimatedTime: Math.max(route.estimatedTime * 0.9, route.estimatedTime - 0.3) // Reduce time by 10% or 0.3h min
      })),
      metrics: {
        ...state.metrics,
        costOptimization: state.metrics.costOptimization + 3.5,
        routeEfficiency: Math.min(state.metrics.routeEfficiency + 4.2, 98)
      },
      isOptimizingRoutes: false
    }));
  },

  validateAndProcessRequest: async (requestText: string, distributorId: string) => {
    const state = get();
    
    // Step 1: Validate distributor exists in our system
    const distributor = state.distributors.find(d => d.id === distributorId);
    if (!distributor) {
      return 'INVALID_DISTRIBUTOR';
    }

    // Step 2: Extract product information from text using AI simulation
    const productKeywords = {
      'p1': ['premium lager', 'lager', 'beer 500ml', 'premium beer'],
      'p2': ['craft ipa', 'ipa', 'craft beer', 'pale ale'],
      'p3': ['red wine', 'wine', 'cabernet', 'merlot'],
      'p4': ['vodka', 'premium vodka', 'spirits', 'distilled'],
      'p5': ['rtd cocktail', 'cocktail', 'ready to drink', 'rtd'],
      'p6': ['light beer', 'light lager', 'low calorie beer']
    };

    let detectedProductId = null;
    let confidence = 0;

    for (const [productId, keywords] of Object.entries(productKeywords)) {
      const matches = keywords.filter(keyword => 
        requestText.toLowerCase().includes(keyword.toLowerCase())
      );
      if (matches.length > 0) {
        detectedProductId = productId;
        confidence = Math.min(0.9, 0.6 + (matches.length * 0.1));
        break;
      }
    }

    if (!detectedProductId) {
      return 'INVALID_PRODUCT';
    }

    // Step 3: Extract quantities and change type
    const quantityRegex = /(\d+)\s*(?:to|→)\s*(\d+)|increase.*?(\d+).*?(\d+)|(\d+)\s*units?/gi;
    const matches: RegExpExecArray[] = [];
    let regexMatch;
    while ((regexMatch = quantityRegex.exec(requestText)) !== null) {
      matches.push(regexMatch);
    }
    
    if (matches.length === 0) {
      return 'INVALID_QUANTITY';
    }

    let fromQuantity = 0;
    let toQuantity = 0;
    let changeType: 'increase' | 'decrease' | 'substitute' = 'increase';

    // Parse quantities
    const firstMatch = matches[0];
    if (firstMatch && firstMatch[1] && firstMatch[2]) {
      fromQuantity = parseInt(firstMatch[1]);
      toQuantity = parseInt(firstMatch[2]);
    } else if (firstMatch && firstMatch[3] && firstMatch[4]) {
      fromQuantity = parseInt(firstMatch[3]);
      toQuantity = parseInt(firstMatch[4]);
    } else if (firstMatch && firstMatch[5]) {
      toQuantity = parseInt(firstMatch[5]);
      fromQuantity = Math.floor(toQuantity * 0.8); // Assume 20% increase
    }

    // Determine change type
    if (requestText.toLowerCase().includes('substitute') || requestText.toLowerCase().includes('replace')) {
      changeType = 'substitute';
    } else if (toQuantity < fromQuantity) {
      changeType = 'decrease';
    }

    return 'VALID';
  },

  runFullAnalysis: async (requestId: string) => {
    set({ isAnalyzingRequest: true });
    const state = get();
    const request = state.changeRequests.find(r => r.id === requestId);
    if (!request) {
      set({ isAnalyzingRequest: false });
      return;
    }
    const distributor = state.distributors.find(d => d.id === request.distributorId);
    const requestedChange = request.requestedChanges[0];
    const product = state.products.find(p => p.id === requestedChange.productId);

    // 1. Current order quantity
    const currentOrderQty = request.originalOrder.reduce((sum, o) => sum + o.quantity, 0);

    // 2. Distributor priority (simulate: add a 'priority' field to distributor or use request.priority)
    // For now, use request.priority ('critical' > 'high' > 'medium' > 'low')
    const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
    const thisPriority = priorityMap[request.priority || 'medium'] || 2;
    // Find all requests for this product that are pending/approved
    const competingRequests = state.changeRequests.filter(r =>
      r.id !== requestId &&
      r.requestedChanges.some(c => c.productId === requestedChange.productId) &&
      ['pending', 'approved', 'analyzing'].includes(r.status)
    );
    // If conflict, allow higher priority to get more volume
    let allowedQty = requestedChange.toQuantity;
    if (competingRequests.length > 0) {
      const maxPriority = Math.max(...competingRequests.map(r => priorityMap[r.priority || 'medium'] || 2));
      if (thisPriority < maxPriority) {
        allowedQty = requestedChange.fromQuantity; // No increase allowed
      }
    }

    // 3. Warehouse capacity/location/cost optimization (allow partial fulfillment)
    const relevantWarehouses = state.warehouses.filter(w =>
      w.currentInventory.some(inv => inv.productId === requestedChange.productId)
    );
    let qtyNeeded = allowedQty - requestedChange.fromQuantity;
    let sources: any[] = [];
    let totalCost = 0;
    let deliveryDate = new Date(Date.now() + 86400000);
    let fulfilledQty = 0;
    // Sort warehouses by cost to distributor (minimize cost, then by proximity if needed)
    const warehouseRoutePairs = relevantWarehouses.map(w => {
      const route = state.routes.find(r => r.fromWarehouseId === w.id && r.toDistributorId === request.distributorId);
      return { w, route, cost: route ? route.cost : 99999 };
    }).sort((a, b) => a.cost - b.cost);
    for (const { w, route, cost } of warehouseRoutePairs) {
      if (!route) continue;
      const inv = w.currentInventory.find(inv => inv.productId === requestedChange.productId);
      const available = inv?.availableStock || 0;
      if (available <= 0) continue;
      const takeQty = Math.min(qtyNeeded, available);
      if (takeQty > 0) {
        sources.push({
          warehouseId: w.id,
          productId: requestedChange.productId,
          quantity: takeQty,
          routeId: route.id,
          cost: cost * (takeQty / qtyNeeded),
          estimatedDelivery: new Date(Date.now() + (route.estimatedTime * 3600000))
        });
        totalCost += cost * (takeQty / qtyNeeded);
        deliveryDate = new Date(Math.max(deliveryDate.getTime(), Date.now() + (route.estimatedTime * 3600000)));
        fulfilledQty += takeQty;
        qtyNeeded -= takeQty;
      }
      if (qtyNeeded <= 0) break;
    }

    // 4. Use historical forecast and actuals if available (no demand forecasting engine)
    // For now, just show historical forecast if present
    const forecast = state.demandForecasts.find(f =>
      f.distributorId === request.distributorId &&
      f.productId === requestedChange.productId
    );
    let forecastVariance = 0;
    if (forecast) {
      forecastVariance = ((allowedQty - forecast.predictedDemand) / forecast.predictedDemand) * 100;
    }

    // 5. Business impact (simulate)
    const revenueImpact = fulfilledQty * (product?.unitCost || 0) * 1.4;
    const netImpact = revenueImpact - totalCost;

    // 6. Risk assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const riskFactors: string[] = [];
    if (Math.abs(forecastVariance) > 25) {
      riskLevel = 'medium';
      riskFactors.push(`${forecastVariance > 0 ? 'Above' : 'Below'} forecast by ${Math.abs(forecastVariance).toFixed(1)}%`);
    }
    if (fulfilledQty < allowedQty - requestedChange.fromQuantity) {
      riskLevel = 'medium';
      riskFactors.push('Partial fulfillment only');
    }
    if (fulfilledQty === 0) {
      riskLevel = 'high';
      riskFactors.push('No inventory available');
    }
    if (netImpact < 0) {
      riskLevel = 'high';
      riskFactors.push('Negative net revenue impact');
    }

    // 7. Recommendation
    const shouldApprove = fulfilledQty > 0 && netImpact > 0 && riskLevel !== 'high';

    // 8. Update request with analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    set((state) => ({
      changeRequests: state.changeRequests.map(req =>
        req.id === requestId ? {
          ...req,
          status: 'analyzing',
          interpretedRequest: {
            ...req.interpretedRequest,
            confidence: 0.92,
            estimatedImpact: {
              revenue: revenueImpact,
              volume: fulfilledQty,
              customerSatisfaction: shouldApprove ? 0.9 : 0.6
            }
          }
        } : req
      ),
      isAnalyzingRequest: false
    }));

    // 9. Generate source plan if approved or partial
    if (shouldApprove) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSourcePlan: SourcePlan = {
        requestId,
        approved: true,
        sources,
        totalCost,
        deliveryDate,
        riskAssessment: {
          level: riskLevel,
          factors: riskFactors.length > 0 ? riskFactors : ['All systems optimal', 'Sufficient inventory available']
        },
        alternatives: []
      };
      set((state) => ({
        sourcePlans: [...state.sourcePlans.filter(sp => sp.requestId !== requestId), newSourcePlan],
        changeRequests: state.changeRequests.map(req =>
          req.id === requestId ? { ...req, status: 'approved' } : req
        )
      }));
    } else {
      // Reject with detailed reason
      const rejectionReason = [
        fulfilledQty === 0 ? 'No inventory available' : '',
        netImpact < 0 ? 'Negative revenue impact' : '',
        riskLevel === 'high' ? 'High risk assessment' : ''
      ].filter(Boolean).join('; ');
      set((state) => ({
        changeRequests: state.changeRequests.map(req =>
          req.id === requestId ? { ...req, status: 'rejected' } : req
        )
      }));
    }
  }
}));
