export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  description?: string;
  price: number;
  minStockLevel: number;
  maxStockLevel: number;
  currentStock: number;
  isOutOfStock: boolean;
  demandForecast?: DemandForecast;
  lastRestocked?: Date;
  supplier?: Supplier;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  address: Address;
  region: string;
  district: string;
  manager: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: OperatingHours;
  isActive: boolean;
  totalProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  oosPercentage: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OperatingHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface TimeSlot {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface OOSEvent {
  id: string;
  productId: string;
  storeId: string;
  timestamp: Date;
  eventType: 'stock_out' | 'low_stock' | 'restock' | 'predicted_stockout';
  currentStock: number;
  previousStock: number;
  predictedStockoutDate?: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isResolved: boolean;
  resolvedAt?: Date;
  estimatedLostSales?: number;
  impact: {
    customers: number;
    revenue: number;
    satisfaction: number;
  };
}

export interface Alert {
  id: string;
  type: 'stockout' | 'low_stock' | 'predicted_stockout' | 'supplier_delay' | 'demand_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  productId?: string;
  storeId?: string;
  timestamp: Date;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  actions: AlertAction[];
  priority: number;
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'reorder' | 'transfer' | 'contact_supplier' | 'notify_manager' | 'update_forecast';
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
}

export interface DemandForecast {
  productId: string;
  storeId: string;
  period: 'daily' | 'weekly' | 'monthly';
  forecastDate: Date;
  predictedDemand: number;
  confidence: number;
  factors: ForecastFactor[];
  seasonality: SeasonalityPattern;
  historicalAccuracy: number;
}

export interface ForecastFactor {
  type: 'weather' | 'event' | 'promotion' | 'holiday' | 'trend';
  name: string;
  impact: number;
  confidence: number;
}

export interface SeasonalityPattern {
  dayOfWeek: number[];
  monthOfYear: number[];
  holidays: string[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: Address;
  deliveryTime: number; // days
  reliability: number; // percentage
  products: string[]; // product IDs
}

export interface InventoryLevel {
  productId: string;
  storeId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  inTransitStock: number;
  lastUpdated: Date;
  stockMovements: StockMovement[];
}

export interface StockMovement {
  id: string;
  type: 'sale' | 'restock' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'return';
  quantity: number;
  timestamp: Date;
  reference?: string;
  notes?: string;
}

export interface WeatherData {
  date: Date;
  temperature: number;
  humidity: number;
  precipitation: number;
  condition: string;
  storeId: string;
}

export interface ExternalEvent {
  id: string;
  name: string;
  type: 'holiday' | 'festival' | 'sports' | 'concert' | 'promotion' | 'market';
  date: Date;
  endDate?: Date;
  location: string;
  expectedImpact: 'low' | 'medium' | 'high';
  affectedStores: string[];
  affectedProducts: string[];
}

export interface PerformanceMetrics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  totalOOSEvents: number;
  avgOOSDuration: number; // hours
  stockoutRate: number; // percentage
  serviceLevel: number; // percentage
  lostSales: number;
  customerSatisfaction: number;
  forecastAccuracy: number;
  inventoryTurnover: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  firstName: string;
  lastName: string;
  storeAccess: string[]; // store IDs
  permissions: Permission[];
  preferences: UserPreferences;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: NotificationSettings;
  defaultView: string;
  refreshInterval: number; // seconds
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  alertTypes: string[];
}
