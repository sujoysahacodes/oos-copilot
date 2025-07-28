// Types for the Alcoholic Beverage Distribution OOS Copilot

export interface Product {
  id: string;
  name: string;
  category: 'beer' | 'wine' | 'spirits' | 'rtd'; // Ready-to-drink
  sku: string;
  volume: number; // in liters
  alcoholContent: number; // percentage
  unitCost: number;
  shelfLife: number; // days
}

export interface Distributor {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: number; // maximum units they can store
  currentInventory: DistributorInventory[];
  creditLimit: number;
  paymentTerms: string;
  deliveryWindow: {
    preferredDays: string[];
    timeSlot: string;
  };
  salesHistory: SalesHistory[];
}

export interface DistributorInventory {
  productId: string;
  currentStock: number;
  reservedStock: number;
  lastUpdated: Date;
  reorderPoint: number;
  maxStock: number;
}

export interface SalesHistory {
  productId: string;
  date: Date;
  quantitySold: number;
  revenue: number;
  seasonalFactor: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: 'factory' | 'distribution_center' | 'regional_warehouse';
  capacity: number;
  currentInventory: WarehouseInventory[];
  operatingHours: {
    start: string;
    end: string;
    workingDays: string[];
  };
  shippingCapabilities: string[];
}

export interface WarehouseInventory {
  productId: string;
  availableStock: number;
  inTransitStock: number;
  reservedStock: number;
  lastRestocked: Date;
  productionSchedule?: Date[]; // for factories
}

export interface Route {
  id: string;
  fromWarehouseId: string;
  toDistributorId: string;
  distance: number; // in km
  estimatedTime: number; // in hours
  cost: number;
  capacity: number; // max units per shipment
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  reliability: number; // percentage
  restrictions: string[]; // e.g., "no weekend delivery", "temperature controlled"
}

export interface ChangeRequest {
  id: string;
  distributorId: string;
  requestDate: Date;
  originalOrder: OrderItem[];
  requestedChanges: RequestedChange[];
  requestText: string; // raw text from email/ServiceNow
  interpretedRequest: InterpretedRequest;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'analyzing' | 'approved' | 'rejected' | 'fulfilled';
  deadline: Date;
  reason: string;
  requestSource: 'email' | 'servicenow' | 'phone' | 'portal';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  scheduledDelivery: Date;
}

export interface RequestedChange {
  type: 'increase' | 'decrease' | 'substitute' | 'reschedule' | 'cancel';
  productId: string;
  fromQuantity: number;
  toQuantity: number;
  alternativeProductId?: string;
  newDeliveryDate?: Date;
  reason: string;
}

export interface InterpretedRequest {
  confidence: number; // 0-1
  extractedChanges: RequestedChange[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  businessReason: string;
  estimatedImpact: {
    revenue: number;
    volume: number;
    customerSatisfaction: number;
  };
  keyTerms: string[];
}

export interface DemandForecast {
  distributorId: string;
  productId: string;
  forecastDate: Date;
  predictedDemand: number;
  confidence: number;
  factors: ForecastFactor[];
  historicalAccuracy: number;
  seasonalTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface ForecastFactor {
  type: 'seasonal' | 'promotional' | 'economic' | 'competitive' | 'weather' | 'event';
  impact: number; // -1 to 1
  description: string;
  confidence: number;
}

export interface DecisionCriteria {
  maxDeviationPercent: number; // max % change allowed from original order
  minProfitMargin: number;
  routeCapacityUtilization: number; // minimum utilization to approve
  creditLimitBuffer: number; // % of credit limit to maintain
  inventoryBuffer: number; // minimum inventory to maintain
  strategicCustomerPriority: boolean;
}

export interface SourcePlan {
  requestId: string;
  approved: boolean;
  rejectionReason?: string;
  sources: SourceAllocation[];
  totalCost: number;
  deliveryDate: Date;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  alternatives: AlternativePlan[];
}

export interface SourceAllocation {
  warehouseId: string;
  productId: string;
  quantity: number;
  routeId: string;
  cost: number;
  estimatedDelivery: Date;
}

export interface AlternativePlan {
  description: string;
  sources: SourceAllocation[];
  cost: number;
  deliveryDate: Date;
  pros: string[];
  cons: string[];
}

export interface Metrics {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  averageResponseTime: number; // hours
  fulfillmentRate: number; // percentage
  costOptimization: number; // percentage saved vs standard delivery
  customerSatisfaction: number;
  inventoryTurnover: number;
  routeEfficiency: number;
}

export interface Alert {
  id: string;
  type: 'inventory_low' | 'route_disruption' | 'demand_spike' | 'credit_limit' | 'quality_issue';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  entityId: string; // warehouse, distributor, or route ID
  timestamp: Date;
  resolved: boolean;
  actions: string[];
}
