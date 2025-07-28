'use client';

import { useState, useEffect } from 'react';
import { useOOSStore } from '@/stores/oosStore';
import { 
  Download,
  RefreshCw,
  AlertTriangle,
  Package,
  Clock,
  Activity,
  ArrowUp,
  ArrowDown,
  DollarSign,
  MapPin
} from 'lucide-react';

interface HistoricalData {
  date: string;
  totalOOSEvents: number;
  averageResolutionTime: number;
  impactedStores: number;
  revenueloss: number;
  topCategories: Array<{
    category: string;
    events: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    oosEvents: number;
    resolutionTime: number;
    customerComplaints: number;
  }>;
}

interface StorePerformance {
  storeId: string;
  storeName: string;
  oosEvents: number;
  averageStock: number;
  performance: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export default function HistoricalAnalysis() {
  const { stores, products, isLoadingStores } = useOOSStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedStore, setSelectedStore] = useState('all');
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [storePerformance, setStorePerformance] = useState<StorePerformance[]>([]);

  useEffect(() => {
    generateHistoricalData();
  }, [selectedPeriod, selectedStore, stores, products]);

  const generateHistoricalData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Ensure we have stores data before generating
      if (stores.length === 0) {
        console.log('No stores data available, retrying...');
        setIsLoading(false);
        return;
      }

      console.log('Generating historical data with', stores.length, 'stores');

      const mockData: HistoricalData = {
        date: new Date().toISOString().split('T')[0],
        totalOOSEvents: Math.floor(Math.random() * 150) + 50,
        averageResolutionTime: Math.floor(Math.random() * 8) + 2,
        impactedStores: Math.floor(Math.random() * stores.length) + 1,
        revenueloss: Math.floor(Math.random() * 50000) + 10000,
        topCategories: [
          { category: 'Beverages', events: 25, percentage: 35 },
          { category: 'Dairy', events: 18, percentage: 25 },
          { category: 'Bakery', events: 12, percentage: 17 },
          { category: 'Produce', events: 8, percentage: 11 },
          { category: 'Pantry', events: 6, percentage: 8 },
          { category: 'Meat', events: 3, percentage: 4 }
        ],
        monthlyTrends: [
          { month: 'Jan', oosEvents: 45, resolutionTime: 6.2, customerComplaints: 12 },
          { month: 'Feb', oosEvents: 52, resolutionTime: 5.8, customerComplaints: 15 },
          { month: 'Mar', oosEvents: 38, resolutionTime: 4.9, customerComplaints: 8 },
          { month: 'Apr', oosEvents: 61, resolutionTime: 7.1, customerComplaints: 18 },
          { month: 'May', oosEvents: 47, resolutionTime: 5.3, customerComplaints: 11 },
          { month: 'Jun', oosEvents: 55, resolutionTime: 6.0, customerComplaints: 14 },
          { month: 'Jul', oosEvents: 42, resolutionTime: 4.7, customerComplaints: 9 }
        ]
      };

      const mockStorePerformance: StorePerformance[] = stores.map((store) => ({
        storeId: store.id,
        storeName: store.name,
        oosEvents: Math.floor(Math.random() * 20) + 5,
        averageStock: Math.floor(Math.random() * 30) + 70,
        performance: (['excellent', 'good', 'needs_improvement', 'critical'] as const)[Math.floor(Math.random() * 4)],
        trend: (['improving', 'stable', 'declining'] as const)[Math.floor(Math.random() * 3)]
      }));

      setHistoricalData(mockData);
      setStorePerformance(mockStorePerformance);
      setIsLoading(false);
    }, 1000);
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const csvContent = [
      'Historical Analysis Report',
      `Generated: ${new Date().toLocaleString()}`,
      `Period: ${selectedPeriod}`,
      `Store: ${selectedStore === 'all' ? 'All Stores' : stores.find(s => s.id === selectedStore)?.name}`,
      '',
      'Summary Metrics',
      'Metric,Value',
      `Total OOS Events,${historicalData?.totalOOSEvents}`,
      `Average Resolution Time,${historicalData?.averageResolutionTime} hours`,
      `Impacted Stores,${historicalData?.impactedStores}`,
      `Revenue Loss,$${historicalData?.revenueloss?.toLocaleString()}`,
      '',
      'Category Breakdown',
      'Category,Events,Percentage',
      ...(historicalData?.topCategories.map(cat => `${cat.category},${cat.events},${cat.percentage}%`) || []),
      '',
      'Store Performance',
      'Store,OOS Events,Average Stock %,Performance,Trend',
      ...storePerformance.map(store => `${store.storeName},${store.oosEvents},${store.averageStock}%,${store.performance},${store.trend}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oos-historical-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setIsExporting(false);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  if (isLoading || isLoadingStores) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Historical Analysis</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading historical data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!historicalData && stores.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Historical Analysis</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No store data available</p>
              <p className="text-sm text-gray-400">Please ensure stores are loaded</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!historicalData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Historical Analysis</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">No historical data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historical Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze trends and performance over time</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <select 
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Stores</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          
          <button
            onClick={handleExportReport}
            disabled={isExporting || !historicalData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isExporting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total OOS Events</p>
              <p className="text-2xl font-bold text-red-600">{historicalData.totalOOSEvents}</p>
              <p className="text-xs text-gray-500">{getPeriodLabel(selectedPeriod)}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-blue-600">{historicalData.averageResolutionTime}h</p>
              <p className="text-xs text-gray-500">Per incident</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Impacted Stores</p>
              <p className="text-2xl font-bold text-orange-600">{historicalData.impactedStores}</p>
              <p className="text-xs text-gray-500">Out of {stores.length} stores</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue Loss</p>
              <p className="text-2xl font-bold text-red-600">${historicalData.revenueloss.toLocaleString()}</p>
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
            {historicalData.monthlyTrends.map((trend, index) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <div 
                    className="bg-primary-500 rounded-t mx-auto"
                    style={{ 
                      height: `${(trend.oosEvents / 70) * 100}px`,
                      width: '24px'
                    }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1">{trend.month}</div>
                  <div className="text-xs font-medium text-gray-900">{trend.oosEvents}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 text-center">OOS Events by Month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">OOS Events by Category</h3>
          <div className="space-y-3">
            {historicalData.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{category.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{category.events}</span>
                  <span className="text-xs text-gray-500 w-10">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance</h3>
          <div className="space-y-3">
            {storePerformance.map((store, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{store.storeName}</div>
                  <div className="text-xs text-gray-500">{store.oosEvents} OOS events</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(store.performance)}`}>
                    {store.performance.replace('_', ' ')}
                  </span>
                  {getTrendIcon(store.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Monthly Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OOS Events</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Resolution (hrs)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Complaints</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historicalData.monthlyTrends.map((trend, index) => {
                const previousTrend = index > 0 ? historicalData.monthlyTrends[index - 1] : null;
                let trendIcon = <Activity className="h-4 w-4 text-gray-500" />;
                
                if (previousTrend) {
                  if (trend.oosEvents > previousTrend.oosEvents) {
                    trendIcon = <ArrowUp className="h-4 w-4 text-red-500" />;
                  } else if (trend.oosEvents < previousTrend.oosEvents) {
                    trendIcon = <ArrowDown className="h-4 w-4 text-green-500" />;
                  }
                }
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trend.month} 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trend.oosEvents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trend.resolutionTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trend.customerComplaints}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {trendIcon}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
