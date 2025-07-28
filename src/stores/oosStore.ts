import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import {
  Product,
  Store,
  OOSEvent,
  Alert,
  DemandForecast,
  PerformanceMetrics,
  InventoryLevel,
} from '@/types';

interface OOSState {
  // Real-time data
  socket: Socket | null;
  isConnected: boolean;
  
  // Products
  products: Product[];
  selectedProduct: Product | null;
  
  // Stores
  stores: Store[];
  selectedStore: Store | null;
  
  // OOS Events
  oosEvents: OOSEvent[];
  recentEvents: OOSEvent[];
  
  // Alerts
  alerts: Alert[];
  unreadAlerts: Alert[];
  
  // Forecasts
  demandForecasts: DemandForecast[];
  
  // Performance Metrics
  performanceMetrics: PerformanceMetrics | null;
  
  // Inventory
  inventoryLevels: InventoryLevel[];
  
  // Loading states
  isLoading: boolean;
  isLoadingProducts: boolean;
  isLoadingStores: boolean;
  isLoadingAlerts: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  initializeRealTimeConnection: () => void;
  disconnectRealTime: () => void;
  
  // Product actions
  fetchProducts: () => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
  
  // Store actions
  fetchStores: () => Promise<void>;
  setSelectedStore: (store: Store | null) => void;
  
  // Alert actions
  fetchAlerts: () => Promise<void>;
  markAlertAsRead: (alertId: string) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  
  // OOS Event actions
  fetchOOSEvents: () => Promise<void>;
  
  // Forecast actions
  fetchDemandForecasts: () => Promise<void>;
  
  // Performance metrics actions
  fetchPerformanceMetrics: (period: string) => Promise<void>;
  
  // Inventory actions
  fetchInventoryLevels: () => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOOSStore = create<OOSState>((set, get) => {
  console.log('Creating OOS Store with mock data...');
  
  return {
  // Initial state with mock data for static deployment
  socket: null,
  isConnected: true,
  products: [
    {
      id: '1',
      name: 'Premium Coffee Beans',
      sku: 'PCB-001',
      category: 'Beverages',
      brand: 'Global Coffee',
      price: 12.99,
      minStockLevel: 20,
      maxStockLevel: 100,
      currentStock: 45,
      isOutOfStock: false,
      lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-1',
        name: 'Global Coffee Co.',
        contactPerson: 'John Coffee',
        phone: '+1-555-0101',
        email: 'orders@globalcoffee.com',
        address: {
          street: '123 Coffee Street',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA',
        },
        deliveryTime: 3,
        reliability: 95,
        products: ['1'],
      },
    },
    {
      id: '2',
      name: 'Organic Milk 1L',
      sku: 'OM-1L-001',
      category: 'Dairy',
      brand: 'Fresh Farms',
      price: 3.49,
      minStockLevel: 15,
      maxStockLevel: 50,
      currentStock: 8,
      isOutOfStock: false,
      lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-2',
        name: 'Fresh Farms Ltd.',
        contactPerson: 'Mary Farm',
        phone: '+1-555-0202',
        email: 'orders@freshfarms.com',
        address: {
          street: '456 Farm Road',
          city: 'Vermont',
          state: 'VT',
          zipCode: '05601',
          country: 'USA',
        },
        deliveryTime: 1,
        reliability: 98,
        products: ['2'],
      },
    },
    {
      id: '3',
      name: 'Whole Grain Bread',
      sku: 'WGB-500',
      category: 'Bakery',
      brand: 'Artisan',
      price: 2.99,
      minStockLevel: 10,
      maxStockLevel: 30,
      currentStock: 0,
      isOutOfStock: true,
      lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-3',
        name: 'Artisan Bakery',
        contactPerson: 'Bob Baker',
        phone: '+1-555-0303',
        email: 'orders@artisanbakery.com',
        address: {
          street: '789 Bakery Lane',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA',
        },
        deliveryTime: 1,
        reliability: 92,
        products: ['3'],
      },
    },
    {
      id: '4',
      name: 'Greek Yogurt 500g',
      sku: 'GY-500',
      category: 'Dairy',
      brand: 'Mediterranean',
      price: 4.99,
      minStockLevel: 15,
      maxStockLevel: 40,
      currentStock: 25,
      isOutOfStock: false,
      lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-4',
        name: 'Mediterranean Foods',
        contactPerson: 'Anna Greek',
        phone: '+1-555-0404',
        email: 'orders@medfoods.com',
        address: {
          street: '321 Mediterranean Ave',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          country: 'USA',
        },
        deliveryTime: 2,
        reliability: 96,
        products: ['4'],
      },
    },
    {
      id: '5',
      name: 'Energy Drink 250ml',
      sku: 'ED-250',
      category: 'Beverages',
      brand: 'PowerBoost',
      price: 2.49,
      minStockLevel: 30,
      maxStockLevel: 120,
      currentStock: 0,
      isOutOfStock: true,
      lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-5',
        name: 'PowerBoost Distributors',
        contactPerson: 'Mike Energy',
        phone: '+1-555-0505',
        email: 'orders@powerboost.com',
        address: {
          street: '789 Energy Blvd',
          city: 'Las Vegas',
          state: 'NV',
          zipCode: '89101',
          country: 'USA',
        },
        deliveryTime: 3,
        reliability: 88,
        products: ['5'],
      },
    },
    {
      id: '6',
      name: 'Chocolate Chips 200g',
      sku: 'CC-200',
      category: 'Snacks',
      brand: 'Sweet Treats',
      price: 3.99,
      minStockLevel: 20,
      maxStockLevel: 60,
      currentStock: 5,
      isOutOfStock: false,
      lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-6',
        name: 'Sweet Treats Co.',
        contactPerson: 'Sarah Sweet',
        phone: '+1-555-0606',
        email: 'orders@sweettreats.com',
        address: {
          street: '456 Candy Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        deliveryTime: 2,
        reliability: 94,
        products: ['6'],
      },
    },
    {
      id: '7',
      name: 'Organic Apples 1kg',
      sku: 'OA-1000',
      category: 'Produce',
      brand: 'Fresh Organic',
      price: 4.99,
      minStockLevel: 25,
      maxStockLevel: 80,
      currentStock: 0,
      isOutOfStock: true,
      lastRestocked: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      supplier: {
        id: 'sup-7',
        name: 'Fresh Organic Farms',
        contactPerson: 'Tom Farmer',
        phone: '+1-555-0707',
        email: 'orders@freshorganic.com',
        address: {
          street: '321 Farm Valley',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA',
        },
        deliveryTime: 1,
        reliability: 97,
        products: ['7'],
      },
    }
  ],
  selectedProduct: null,
  stores: [
    {
      id: 'store-1',
      name: 'Downtown Plaza',
      code: 'DTP-001',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      region: 'Northeast',
      district: 'Manhattan',
      manager: 'John Smith',
      phone: '+1-555-0123',
      email: 'downtown@company.com',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      operatingHours: {
        monday: { open: '06:00', close: '22:00', isClosed: false },
        tuesday: { open: '06:00', close: '22:00', isClosed: false },
        wednesday: { open: '06:00', close: '22:00', isClosed: false },
        thursday: { open: '06:00', close: '22:00', isClosed: false },
        friday: { open: '06:00', close: '22:00', isClosed: false },
        saturday: { open: '07:00', close: '21:00', isClosed: false },
        sunday: { open: '08:00', close: '20:00', isClosed: false },
      },
      isActive: true,
      totalProducts: 1250,
      outOfStockProducts: 5,
      lowStockProducts: 23,
      oosPercentage: 0.4,
    },
    {
      id: 'store-2',
      name: 'Suburban Center',
      code: 'SC-002',
      address: {
        street: '456 Oak Avenue',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        country: 'USA',
      },
      region: 'Northeast',
      district: 'Brooklyn',
      manager: 'Sarah Johnson',
      phone: '+1-555-0456',
      email: 'suburban@company.com',
      coordinates: { lat: 40.6782, lng: -73.9442 },
      operatingHours: {
        monday: { open: '07:00', close: '21:00', isClosed: false },
        tuesday: { open: '07:00', close: '21:00', isClosed: false },
        wednesday: { open: '07:00', close: '21:00', isClosed: false },
        thursday: { open: '07:00', close: '21:00', isClosed: false },
        friday: { open: '07:00', close: '21:00', isClosed: false },
        saturday: { open: '08:00', close: '20:00', isClosed: false },
        sunday: { open: '09:00', close: '19:00', isClosed: false },
      },
      isActive: true,
      totalProducts: 980,
      outOfStockProducts: 3,
      lowStockProducts: 18,
      oosPercentage: 0.31,
    },
    {
      id: 'store-3',
      name: 'Airport Terminal',
      code: 'AT-003',
      address: {
        street: '789 Terminal Drive',
        city: 'Queens',
        state: 'NY',
        zipCode: '11430',
        country: 'USA',
      },
      region: 'Northeast',
      district: 'Queens',
      manager: 'Mike Chen',
      phone: '+1-555-0789',
      email: 'airport@company.com',
      coordinates: { lat: 40.6413, lng: -73.7781 },
      operatingHours: {
        monday: { open: '00:00', close: '23:59', isClosed: false },
        tuesday: { open: '00:00', close: '23:59', isClosed: false },
        wednesday: { open: '00:00', close: '23:59', isClosed: false },
        thursday: { open: '00:00', close: '23:59', isClosed: false },
        friday: { open: '00:00', close: '23:59', isClosed: false },
        saturday: { open: '00:00', close: '23:59', isClosed: false },
        sunday: { open: '00:00', close: '23:59', isClosed: false },
      },
      isActive: false,
      totalProducts: 650,
      outOfStockProducts: 12,
      lowStockProducts: 35,
      oosPercentage: 1.85,
    }
  ],
  selectedStore: null,
  oosEvents: [
    {
      id: 'oos-1',
      productId: '3',
      storeId: 'store-1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      eventType: 'stock_out' as const,
      currentStock: 0,
      previousStock: 5,
      severity: 'high' as const,
      isResolved: false,
      impact: {
        customers: 25,
        revenue: 74.75,
        satisfaction: 0.72,
      },
    },
    {
      id: 'oos-2',
      productId: '2',
      storeId: 'store-2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      eventType: 'low_stock' as const,
      currentStock: 8,
      previousStock: 22,
      severity: 'medium' as const,
      isResolved: false,
      impact: {
        customers: 12,
        revenue: 41.88,
        satisfaction: 0.85,
      },
    }
  ],
  recentEvents: [
    {
      id: 'oos-1',
      productId: '3',
      storeId: 'store-1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      eventType: 'stock_out' as const,
      currentStock: 0,
      previousStock: 5,
      severity: 'high' as const,
      isResolved: false,
      impact: {
        customers: 25,
        revenue: 74.75,
        satisfaction: 0.72,
      },
    },
    {
      id: 'oos-2',
      productId: '2',
      storeId: 'store-2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      eventType: 'low_stock' as const,
      currentStock: 8,
      previousStock: 22,
      severity: 'medium' as const,
      isResolved: false,
      impact: {
        customers: 12,
        revenue: 41.88,
        satisfaction: 0.85,
      },
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      type: 'stockout' as const,
      severity: 'critical' as const,
      title: 'Critical Stock Shortage',
      message: 'Whole Grain Bread is out of stock at Downtown Plaza',
      productId: '3',
      storeId: 'store-1',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      actions: [
        {
          id: 'action-1',
          label: 'Reorder Stock',
          type: 'reorder' as const,
          isCompleted: false,
        },
        {
          id: 'action-2',
          label: 'Contact Supplier',
          type: 'contact_supplier' as const,
          isCompleted: false,
        }
      ],
      priority: 1,
    },
    {
      id: 'alert-2',
      type: 'low_stock' as const,
      severity: 'medium' as const,
      title: 'Low Stock Warning',
      message: 'Organic Milk 1L running low at Suburban Center',
      productId: '2',
      storeId: 'store-2',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      actions: [
        {
          id: 'action-3',
          label: 'Reorder Stock',
          type: 'reorder' as const,
          isCompleted: false,
        }
      ],
      priority: 2,
    },
    {
      id: 'alert-3',
      type: 'stockout' as const,
      severity: 'critical' as const,
      title: 'Energy Drink Out of Stock',
      message: 'Energy Drink 250ml is completely out of stock at Downtown Plaza',
      productId: '5',
      storeId: 'store-1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      actions: [
        {
          id: 'action-4',
          label: 'Emergency Reorder',
          type: 'reorder' as const,
          isCompleted: false,
        },
        {
          id: 'action-5',
          label: 'Find Alternative Supplier',
          type: 'contact_supplier' as const,
          isCompleted: false,
        }
      ],
      priority: 1,
    },
    {
      id: 'alert-4',
      type: 'stockout' as const,
      severity: 'critical' as const,
      title: 'Organic Apples Shortage',
      message: 'Organic Apples 1kg out of stock at Mall Location',
      productId: '7',
      storeId: 'store-3',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      actions: [
        {
          id: 'action-6',
          label: 'Contact Supplier',
          type: 'contact_supplier' as const,
          isCompleted: false,
        }
      ],
      priority: 1,
    },
    {
      id: 'alert-5',
      type: 'low_stock' as const,
      severity: 'medium' as const,
      title: 'Chocolate Chips Running Low',
      message: 'Chocolate Chips 200g below minimum threshold at Suburban Center',
      productId: '6',
      storeId: 'store-2',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      actions: [
        {
          id: 'action-7',
          label: 'Schedule Reorder',
          type: 'reorder' as const,
          isCompleted: false,
        }
      ],
      priority: 2,
    }
  ],
  unreadAlerts: [],
  demandForecasts: [],
  performanceMetrics: null,
  inventoryLevels: [],
  isLoading: false,
  isLoadingProducts: false,
  isLoadingStores: false,
  isLoadingAlerts: false,
  error: null,

  // Real-time connection
  initializeRealTimeConnection: () => {
    // For static deployment, ensure data is immediately available
    console.log('Initializing mock real-time connection...');
    
    // Set connected immediately for demo purposes
    set({ isConnected: true });
    console.log('Mock connection established');
    
    // Ensure all data is properly loaded
    const state = get();
    console.log('Current state after initialization:', {
      products: state.products.length,
      stores: state.stores.length,
      alerts: state.alerts.length,
      isConnected: state.isConnected
    });
    
    // Initialize unread alerts from alerts
    const { alerts } = get();
    const unreadAlerts = alerts.filter(alert => !alert.isRead);
    set({ unreadAlerts });
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      const { oosEvents, recentEvents, alerts, unreadAlerts } = get();
      
      // Mock OOS event
      const mockEvent = {
        id: `oos-${Date.now()}`,
        productId: (Math.floor(Math.random() * 4) + 1).toString(),
        storeId: `store-${Math.floor(Math.random() * 3) + 1}`,
        timestamp: new Date(),
        eventType: 'stock_out' as const,
        currentStock: 0,
        previousStock: Math.floor(Math.random() * 20) + 1,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
        isResolved: false,
        impact: {
          customers: Math.floor(Math.random() * 50),
          revenue: Math.floor(Math.random() * 1000),
          satisfaction: Math.random() * 0.3 + 0.7,
        },
      };

      // Randomly add events (20% chance every interval)
      if (Math.random() < 0.2) {
        set({
          oosEvents: [mockEvent, ...oosEvents.slice(0, 49)],
          recentEvents: [mockEvent, ...recentEvents.slice(0, 9)],
        });
      }
    }, 15000); // Every 15 seconds

    // Store the interval for cleanup
    set({ socket: { disconnect: () => clearInterval(interval) } as any });
  },

  disconnectRealTime: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Product actions
  fetchProducts: async () => {
    // For static deployment, ensure data is available
    const state = get();
    console.log('fetchProducts - Current products:', state.products.length);
    
    // If no products, something went wrong - this shouldn't happen with our initial state
    if (state.products.length === 0) {
      console.error('No products found in initial state!');
    }
    
    console.log('Using initial product data for static deployment');
    set({ isLoadingProducts: false, error: null });
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Store actions
  fetchStores: async () => {
    // For static deployment, ensure data is available
    const state = get();
    console.log('fetchStores - Current stores:', state.stores.length);
    
    // If no stores, something went wrong
    if (state.stores.length === 0) {
      console.error('No stores found in initial state!');
    }
    
    console.log('Using initial store data for static deployment');
    set({ isLoadingStores: false, error: null });
  },

  setSelectedStore: (store) => set({ selectedStore: store }),

  // Alert actions
  fetchAlerts: async () => {
    // For static deployment, ensure data is available
    const { alerts } = get();
    console.log('fetchAlerts - Current alerts:', alerts.length);
    
    // If no alerts, something went wrong
    if (alerts.length === 0) {
      console.error('No alerts found in initial state!');
    }
    
    console.log('Using initial alert data for static deployment');
    const unreadAlerts = alerts.filter((alert: Alert) => !alert.isRead);
    set({ unreadAlerts, isLoadingAlerts: false, error: null });
  },

  markAlertAsRead: (alertId) => {
    const { alerts, unreadAlerts } = get();
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    );
    const updatedUnreadAlerts = unreadAlerts.filter(alert => alert.id !== alertId);
    set({ alerts: updatedAlerts, unreadAlerts: updatedUnreadAlerts });

    // API call to mark as read
    fetch(`/api/alerts/${alertId}/read`, { method: 'POST' });
  },

  acknowledgeAlert: (alertId, userId) => {
    const { alerts } = get();
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            isAcknowledged: true,
            acknowledgedBy: userId,
            acknowledgedAt: new Date(),
          }
        : alert
    );
    set({ alerts: updatedAlerts });

    // API call to acknowledge
    fetch(`/api/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  // OOS Event actions
  fetchOOSEvents: async () => {
    // For static deployment, don't make API calls - data is already in initial state
    console.log('Using initial OOS event data for static deployment');
    const { oosEvents } = get();
    const recentEvents = oosEvents.slice(0, 10);
    set({ recentEvents, isLoading: false, error: null });
  },

  // Forecast actions
  fetchDemandForecasts: async () => {
    // For static deployment, don't make API calls - data is already in initial state
    console.log('Using initial forecast data for static deployment');
    set({ isLoading: false, error: null });
  },

  // Performance metrics actions
  fetchPerformanceMetrics: async (period) => {
    // For static deployment, don't make API calls - data is already in initial state
    console.log('Using initial performance metrics for static deployment');
    set({ isLoading: false, error: null });
  },

  // Inventory actions
  fetchInventoryLevels: async () => {
    // For static deployment, don't make API calls - data is already in initial state
    console.log('Using initial inventory data for static deployment');
    set({ isLoading: false, error: null });
  },

  // Utility actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  };
});
