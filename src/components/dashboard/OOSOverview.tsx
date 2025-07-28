'use client';

import { useEffect } from 'react';
import { useOOSStore } from '@/stores/oosStore';
import { 
  AlertTriangle, 
  Package, 
  Store, 
  TrendingUp, 
  TrendingDown,
  Clock,
  DollarSign
} from 'lucide-react';

export function OOSOverview() {
  const {
    stores,
    products,
    alerts,
    performanceMetrics,
    fetchStores,
    fetchProducts,
    fetchAlerts,
    fetchPerformanceMetrics,
    isLoading,
  } = useOOSStore();

  useEffect(() => {
    console.log('OOSOverview - Initial data:', { 
      products: products.length, 
      stores: stores.length, 
      alerts: alerts.length 
    });
    
    fetchStores();
    fetchProducts();
    fetchAlerts();
    fetchPerformanceMetrics('today');
  }, [fetchStores, fetchProducts, fetchAlerts, fetchPerformanceMetrics]);

  console.log('OOSOverview - Current data:', { 
    products: products.length, 
    stores: stores.length, 
    alerts: alerts.length 
  });

  // Calculate actual metrics from store data
  const outOfStockProducts = products.filter(p => p.isOutOfStock).length;
  const lowStockProducts = products.filter(p => 
    !p.isOutOfStock && p.currentStock <= p.minStockLevel
  ).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const totalStores = stores.length;

  const overviewCards = [
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: AlertTriangle,
      color: 'red',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      icon: Package,
      color: 'orange',
      change: '-5%',
      trend: 'down'
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      icon: Clock,
      color: 'red',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Active Stores',
      value: totalStores,
      icon: Store,
      color: 'blue',
      change: '0%',
      trend: 'neutral'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Real-time out-of-stock monitoring and insights</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          const isIncrease = card.trend === 'up';
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  card.color === 'red' ? 'bg-red-100' :
                  card.color === 'orange' ? 'bg-orange-100' :
                  card.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    card.color === 'red' ? 'text-red-600' :
                    card.color === 'orange' ? 'text-orange-600' :
                    card.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                {card.trend !== 'neutral' && (
                  <>
                    {isIncrease ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      isIncrease ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {card.change}
                    </span>
                  </>
                )}
                <span className="text-sm text-gray-500 ml-2">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Create Manual Alert</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Update Inventory</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Run Forecast</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`p-1 rounded ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500 truncate">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          {performanceMetrics ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Service Level</span>
                <span className="text-sm font-medium text-green-600">
                  {(performanceMetrics.serviceLevel * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Forecast Accuracy</span>
                <span className="text-sm font-medium text-blue-600">
                  {(performanceMetrics.forecastAccuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lost Sales</span>
                <span className="text-sm font-medium text-red-600">
                  ${performanceMetrics.lostSales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-medium text-green-600">
                  {(performanceMetrics.customerSatisfaction * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading performance metrics...</p>
          )}
        </div>
      </div>
    </div>
  );
}
