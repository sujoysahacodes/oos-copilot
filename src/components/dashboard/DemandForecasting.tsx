'use client';

import { useState, useEffect } from 'react';
import { useOOSStore } from '@/stores/oosStore';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar, 
  RefreshCw,
  AlertTriangle,
  Target,
  Brain,
  Clock,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface ForecastData {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  predictedDemand: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  forecastPeriod: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedOrder: number;
  historicalAccuracy: number;
  externalFactors: string[];
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  lastTrained: string;
  dataPoints: number;
  modelType: string;
}

export function DemandForecasting() {
  const { products } = useOOSStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    accuracy: 0.87,
    precision: 0.82,
    recall: 0.91,
    lastTrained: '2025-07-24 14:30:00',
    dataPoints: 2847,
    modelType: 'LSTM Neural Network'
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with some sample forecasts
    generateMockForecasts();
  }, [products]);

  const generateMockForecasts = () => {
    const mockForecasts: ForecastData[] = products.slice(0, 8).map((product, index) => {
      const trends = ['up', 'down', 'stable'] as const;
      const risks = ['low', 'medium', 'high', 'critical'] as const;
      const trend = trends[Math.floor(Math.random() * trends.length)];
      const riskLevel = risks[Math.floor(Math.random() * risks.length)];
      
      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        currentStock: product.currentStock,
        predictedDemand: Math.floor(Math.random() * 200) + 50,
        confidence: Math.floor(Math.random() * 30) + 70,
        trend,
        trendPercentage: Math.floor(Math.random() * 50) + 5,
        forecastPeriod: selectedTimeframe,
        riskLevel,
        recommendedOrder: Math.floor(Math.random() * 100) + 20,
        historicalAccuracy: Math.floor(Math.random() * 20) + 80,
        externalFactors: [
          'Seasonal trends',
          'Weather patterns',
          'Promotional events',
          'Market competition'
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    });
    
    setForecasts(mockForecasts);
  };

  const runForecast = async () => {
    setIsRunning(true);
    setIsLoading(true);
    
    // Simulate AI model running
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate new forecasts
    generateMockForecasts();
    
    // Update model metrics
    setModelMetrics(prev => ({
      ...prev,
      accuracy: Math.min(0.95, prev.accuracy + (Math.random() * 0.04 - 0.02)),
      lastTrained: new Date().toLocaleString(),
      dataPoints: prev.dataPoints + Math.floor(Math.random() * 50) + 10
    }));
    
    setIsLoading(false);
    setIsRunning(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demand Forecasting</h1>
          <p className="text-gray-600 mt-1">AI-powered demand prediction and inventory planning</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Next 7 days</option>
            <option value="14d">Next 14 days</option>
            <option value="30d">Next 30 days</option>
            <option value="90d">Next 90 days</option>
          </select>
          <button 
            onClick={runForecast}
            disabled={isRunning}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Forecast'}
          </button>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Model Accuracy</p>
              <p className="text-2xl font-bold text-green-600">{(modelMetrics.accuracy * 100).toFixed(1)}%</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Confidence</p>
              <p className="text-2xl font-bold text-blue-600">
                {forecasts.filter(f => f.confidence >= 85).length}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {forecasts.filter(f => f.riskLevel === 'high' || f.riskLevel === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">{modelMetrics.dataPoints.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">AI Model: {modelMetrics.modelType}</p>
              <p className="text-sm text-gray-600">
                Last trained: {modelMetrics.lastTrained} | 
                Precision: {(modelMetrics.precision * 100).toFixed(1)}% | 
                Recall: {(modelMetrics.recall * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Updated 2 min ago</span>
          </div>
        </div>
      </div>

      {/* Forecasts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Demand Forecasts</h3>
          <p className="text-sm text-gray-600">Predicted demand for the next {selectedTimeframe}</p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Running AI forecast model...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing historical data and external factors</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Demand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factors</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecasts.map((forecast) => (
                  <tr key={forecast.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{forecast.productName}</div>
                        <div className="text-sm text-gray-500">{forecast.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{forecast.currentStock} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{forecast.predictedDemand} units</div>
                      <div className="text-xs text-gray-500">{selectedTimeframe}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getConfidenceColor(forecast.confidence)}`}>
                        {forecast.confidence}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${forecast.confidence >= 85 ? 'bg-green-500' : forecast.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${forecast.confidence}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(forecast.trend)}
                        <span className="ml-2 text-sm text-gray-900">{forecast.trendPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(forecast.riskLevel)}`}>
                        {forecast.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">{forecast.recommendedOrder} units</div>
                      <div className="text-xs text-gray-500">
                        {forecast.recommendedOrder > forecast.currentStock ? 'Order needed' : 'Stock sufficient'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {forecast.externalFactors.slice(0, 2).map((factor, index) => (
                          <div key={index} className="truncate">{factor}</div>
                        ))}
                        {forecast.externalFactors.length > 2 && (
                          <div className="text-gray-400">+{forecast.externalFactors.length - 2} more</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
            <div className="font-medium text-gray-900">Export Forecasts</div>
            <div className="text-sm text-gray-500">Download forecast data as CSV</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Calendar className="h-6 w-6 text-blue-500 mb-2" />
            <div className="font-medium text-gray-900">Schedule Reports</div>
            <div className="text-sm text-gray-500">Set up automated forecast reports</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <AlertTriangle className="h-6 w-6 text-orange-500 mb-2" />
            <div className="font-medium text-gray-900">Configure Alerts</div>
            <div className="text-sm text-gray-500">Set thresholds for demand alerts</div>
          </button>
        </div>
      </div>
    </div>
  );
}
