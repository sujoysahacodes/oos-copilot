'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { OOSOverview } from './dashboard/OOSOverview';
import { AlertsPanel } from './dashboard/AlertsPanel';
import { StoreMap } from './dashboard/StoreMap';
import { ProductCatalog } from './dashboard/ProductCatalog';
import { DemandForecasting } from './dashboard/DemandForecasting';
import { useOOSStore } from '@/stores/oosStore';
import { 
  Download,
  RefreshCw,
  AlertTriangle,
  Clock,
  DollarSign,
  MapPin
} from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { initializeRealTimeConnection, fetchStores, fetchProducts, fetchAlerts } = useOOSStore();

  useEffect(() => {
    // Initialize WebSocket connection for real-time updates
    initializeRealTimeConnection();
    
    // Load initial data
    fetchStores();
    fetchProducts();
    fetchAlerts();
  }, [initializeRealTimeConnection, fetchStores, fetchProducts, fetchAlerts]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OOSOverview />;
      case 'alerts':
        return <AlertsPanel />;
      case 'stores':
        return <StoreMap />;
      case 'products':
        return <ProductCatalog />;
      case 'forecasting':
        return <DemandForecasting />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Historical Analysis</h1>
                <p className="text-gray-600 mt-1">Analyze trends and performance over time</p>
              </div>
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8,Metric,Value\nTotal Events,127\nAvg Resolution,4.2h\nRevenue Loss,$25000";
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "historical-analysis.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total OOS Events</p>
                    <p className="text-2xl font-bold text-red-600">127</p>
                    <p className="text-xs text-gray-500">Last 30 days</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Resolution Time</p>
                    <p className="text-2xl font-bold text-blue-600">4.2h</p>
                    <p className="text-xs text-gray-500">Per incident</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Impacted Stores</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                    <p className="text-xs text-gray-500">Out of 5 stores</p>
                  </div>
                  <MapPin className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue Loss</p>
                    <p className="text-2xl font-bold text-red-600">$25,000</p>
                    <p className="text-xs text-gray-500">Estimated impact</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                    <div key={month} className="text-center">
                      <div className="mb-2">
                        <div 
                          className="bg-primary-500 rounded-t mx-auto"
                          style={{ 
                            height: `${(45 + index * 5)}px`,
                            width: '24px'
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{month}</div>
                        <div className="text-xs font-medium text-gray-900">{45 + index * 5}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 text-center">OOS Events by Month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories with OOS Events</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Beverages', count: 25, percentage: 35 },
                    { name: 'Dairy', count: 18, percentage: 25 },
                    { name: 'Bakery', count: 12, percentage: 17 },
                    { name: 'Produce', count: 8, percentage: 11 }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{category.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance Summary</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Downtown Main Store', events: 8, status: 'Good' },
                    { name: 'West Side Branch', events: 12, status: 'Needs Attention' },
                    { name: 'North Plaza Store', events: 5, status: 'Excellent' }
                  ].map((store, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{store.name}</div>
                        <div className="text-xs text-gray-500">{store.events} OOS events</div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        store.status === 'Excellent' ? 'text-green-600 bg-green-100' :
                        store.status === 'Good' ? 'text-blue-600 bg-blue-100' :
                        'text-yellow-600 bg-yellow-100'
                      }`}>
                        {store.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Analysis Insights</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-green-600">↗ 15%</div>
                    <div className="text-sm text-gray-600">Resolution Speed Improved</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-red-600">↑ 8%</div>
                    <div className="text-sm text-gray-600">OOS Events This Month</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <OOSOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
