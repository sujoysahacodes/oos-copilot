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

export const useOOSStore = create<OOSState>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  products: [],
  selectedProduct: null,
  stores: [],
  selectedStore: null,
  oosEvents: [],
  recentEvents: [],
  alerts: [],
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
    // For development, simulate a connection
    console.log('Initializing mock real-time connection...');
    
    // Simulate connection after a brief delay
    setTimeout(() => {
      console.log('Mock connection established');
      set({ isConnected: true });
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        const { oosEvents, recentEvents, alerts, unreadAlerts } = get();
        
        // Mock OOS event
        const mockEvent = {
          id: `oos-${Date.now()}`,
          productId: (Math.floor(Math.random() * 10) + 1).toString(),
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
    }, 2000);
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
    set({ isLoadingProducts: true, error: null });
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const products = await response.json();
      set({ products, isLoadingProducts: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoadingProducts: false,
      });
    }
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Store actions
  fetchStores: async () => {
    set({ isLoadingStores: true, error: null });
    try {
      const response = await fetch('/api/stores');
      if (!response.ok) throw new Error('Failed to fetch stores');
      const stores = await response.json();
      set({ stores, isLoadingStores: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoadingStores: false,
      });
    }
  },

  setSelectedStore: (store) => set({ selectedStore: store }),

  // Alert actions
  fetchAlerts: async () => {
    set({ isLoadingAlerts: true, error: null });
    try {
      const response = await fetch('/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const alerts = await response.json();
      const unreadAlerts = alerts.filter((alert: Alert) => !alert.isRead);
      set({ alerts, unreadAlerts, isLoadingAlerts: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoadingAlerts: false,
      });
    }
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
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/oos-events');
      if (!response.ok) throw new Error('Failed to fetch OOS events');
      const oosEvents = await response.json();
      const recentEvents = oosEvents.slice(0, 10);
      set({ oosEvents, recentEvents, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  // Forecast actions
  fetchDemandForecasts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/forecasts');
      if (!response.ok) throw new Error('Failed to fetch demand forecasts');
      const demandForecasts = await response.json();
      set({ demandForecasts, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  // Performance metrics actions
  fetchPerformanceMetrics: async (period) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/metrics?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch performance metrics');
      const performanceMetrics = await response.json();
      set({ performanceMetrics, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  // Inventory actions
  fetchInventoryLevels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory levels');
      const inventoryLevels = await response.json();
      set({ inventoryLevels, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  // Utility actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
