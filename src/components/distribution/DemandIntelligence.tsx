'use client';

import { useDistributionOOSStore } from '../../stores/distributionStore';
import { TrendingUp, BarChart3, Calendar, Target, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

export default function DemandIntelligence() {
  const {
    demandForecasts,
    distributors,
    products,
    changeRequests
  } = useDistributionOOSStore();

  // Mock additional forecast data for demonstration
  const extendedForecasts = [
    {
      distributorId: 'd1',
      productId: 'p1',
      forecastDate: new Date(Date.now() + 604800000),
      predictedDemand: 1200,
      confidence: 0.87,
      factors: [
        { type: 'seasonal', impact: 0.15, description: 'Summer season increase', confidence: 0.9 },
        { type: 'event', impact: 0.25, description: 'Local sports events', confidence: 0.8 }
      ],
      historicalAccuracy: 0.84,
      seasonalTrend: 'increasing'
    },
    {
      distributorId: 'd2',
      productId: 'p5',
      forecastDate: new Date(Date.now() + 604800000),
      predictedDemand: 950,
      confidence: 0.92,
      factors: [
        { type: 'promotional', impact: 0.30, description: 'Summer cocktail campaign', confidence: 0.95 },
        { type: 'weather', impact: 0.12, description: 'High temperatures expected', confidence: 0.7 }
      ],
      historicalAccuracy: 0.89,
      seasonalTrend: 'increasing'
    },
    {
      distributorId: 'd3',
      productId: 'p2',
      forecastDate: new Date(Date.now() + 604800000),
      predictedDemand: 680,
      confidence: 0.78,
      factors: [
        { type: 'competitive', impact: -0.08, description: 'New competitor product launch', confidence: 0.6 },
        { type: 'seasonal', impact: 0.10, description: 'Craft beer season', confidence: 0.85 }
      ],
      historicalAccuracy: 0.76,
      seasonalTrend: 'stable'
    }
  ];

  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'seasonal':
        return <Calendar className="h-4 w-4" />;
      case 'promotional':
        return <Target className="h-4 w-4" />;
      case 'event':
        return <TrendingUp className="h-4 w-4" />;
      case 'weather':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0.15) return 'text-green-600';
    if (impact > 0) return 'text-green-500';
    if (impact > -0.15) return 'text-red-500';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demand Intelligence</h1>
          <p className="text-gray-600 mt-1">AI-powered demand forecasting and market insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span className="text-purple-700 font-medium">ML Models Active</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Update Forecasts
          </button>
        </div>
      </div>

      {/* Forecast Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Average Confidence</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {((extendedForecasts.reduce((sum, f) => sum + f.confidence, 0) / extendedForecasts.length) * 100).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Across all forecasts</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Predicted Demand</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {extendedForecasts.reduce((sum, f) => sum + f.predictedDemand, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Units next week</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Model Accuracy</h3>
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {((extendedForecasts.reduce((sum, f) => sum + f.historicalAccuracy, 0) / extendedForecasts.length) * 100).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Historical accuracy</p>
        </div>
      </div>

      {/* Detailed Forecasts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Weekly Demand Forecasts</h2>
          <p className="text-gray-600 mt-1">AI-generated predictions with confidence intervals</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {extendedForecasts.map((forecast, index) => {
              const distributor = distributors.find(d => d.id === forecast.distributorId);
              const product = products.find(p => p.id === forecast.productId);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{distributor?.name}</h3>
                      <p className="text-gray-600">{product?.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Forecast for {new Date(forecast.forecastDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {forecast.predictedDemand.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">units</div>
                      <div className="flex items-center space-x-1 mt-2">
                        {getTrendIcon(forecast.seasonalTrend)}
                        <span className="text-sm text-gray-600 capitalize">{forecast.seasonalTrend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Forecast Confidence</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Model Confidence</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${forecast.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {(forecast.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Historical Accuracy</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${forecast.historicalAccuracy * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {(forecast.historicalAccuracy * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Influencing Factors</h4>
                      <div className="space-y-2">
                        {forecast.factors.map((factor, factorIndex) => (
                          <div key={factorIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-600">
                                {getFactorIcon(factor.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 capitalize">
                                  {factor.type}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {factor.description}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${getImpactColor(factor.impact)}`}>
                                {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {(factor.confidence * 100).toFixed(0)}% conf.
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-yellow-800 mb-1">Risk Assessment</h5>
                        <p className="text-sm text-yellow-700">
                          {forecast.confidence < 0.8 ? 
                            'Lower confidence forecast - consider manual review and backup planning.' :
                            'High confidence forecast - proceed with standard planning processes.'
                          }
                        </p>
                        {forecast.factors.some(f => f.impact < -0.1) && (
                          <p className="text-sm text-yellow-700 mt-1">
                            Negative factors detected - monitor closely for demand variations.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request vs Forecast Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Request vs Forecast Analysis</h2>
          <p className="text-gray-600 mt-1">Comparing incoming requests against AI predictions</p>
        </div>
        
        <div className="p-6">
          {changeRequests.length > 0 ? (
            <div className="space-y-4">
              {changeRequests.slice(0, 2).map((request) => {
                const distributor = distributors.find(d => d.id === request.distributorId);
                const product = products.find(p => p.id === request.requestedChanges[0]?.productId);
                const forecast = extendedForecasts.find(f => 
                  f.distributorId === request.distributorId && 
                  f.productId === request.requestedChanges[0]?.productId
                );
                
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{distributor?.name}</h3>
                      <p className="text-sm text-gray-600">{product?.name}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Requested</div>
                        <div className="font-semibold text-blue-600">
                          {request.requestedChanges[0]?.toQuantity || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Forecasted</div>
                        <div className="font-semibold text-green-600">
                          {forecast?.predictedDemand || 'N/A'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Variance</div>
                        <div className={`font-semibold ${
                          forecast && request.requestedChanges[0] 
                            ? Math.abs(request.requestedChanges[0].toQuantity - forecast.predictedDemand) / forecast.predictedDemand > 0.2
                              ? 'text-red-600' : 'text-green-600'
                            : 'text-gray-600'
                        }`}>
                          {forecast && request.requestedChanges[0] 
                            ? `${((request.requestedChanges[0].toQuantity - forecast.predictedDemand) / forecast.predictedDemand * 100).toFixed(1)}%`
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active requests to compare with forecasts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
