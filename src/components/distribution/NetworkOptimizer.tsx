'use client';

import { useDistributionOOSStore } from '../../stores/distributionStore';
import { Route, Truck, MapPin, Clock, DollarSign, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

export default function NetworkOptimizer() {
  const {
    routes,
    warehouses,
    distributors,
    sourcePlans,
    changeRequests,
    isOptimizingRoutes,
    optimizeRoutes
  } = useDistributionOOSStore();

  // Mock route performance data
  const routePerformance = routes.map(route => ({
    ...route,
    currentUtilization: Math.random() * 100,
    onTimeDelivery: 85 + Math.random() * 15,
    costEfficiency: 88 + Math.random() * 12,
    lastDelivery: new Date(Date.now() - Math.random() * 86400000 * 7),
    activeShipments: Math.floor(Math.random() * 5),
    alerts: Math.random() > 0.7 ? ['Weather delay expected'] : []
  }));

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 85) return 'text-red-600 bg-red-100';
    if (utilization > 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability > 95) return 'text-green-600';
    if (reliability > 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Optimizer</h1>
          <p className="text-gray-600 mt-1">Intelligent routing and source allocation planning</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
            <Navigation className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Optimization Engine</span>
          </div>
          <button 
            onClick={optimizeRoutes}
            disabled={isOptimizingRoutes}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Navigation className={`h-4 w-4 ${isOptimizingRoutes ? 'animate-spin' : ''}`} />
            <span>{isOptimizingRoutes ? 'Optimizing...' : 'Optimize Routes'}</span>
          </button>
        </div>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Routes</h3>
            <Route className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{routes.length}</div>
          <p className="text-sm text-gray-600">
            {routePerformance.filter(r => r.activeShipments > 0).length} with active shipments
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Avg Utilization</h3>
            <Truck className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {(routePerformance.reduce((sum, r) => sum + r.currentUtilization, 0) / routePerformance.length).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Across all routes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Cost Efficiency</h3>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {(routePerformance.reduce((sum, r) => sum + r.costEfficiency, 0) / routePerformance.length).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">vs industry benchmark</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">On-Time Delivery</h3>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {(routePerformance.reduce((sum, r) => sum + r.onTimeDelivery, 0) / routePerformance.length).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Last 30 days</p>
        </div>
      </div>

      {/* Route Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Route Performance</h2>
          <p className="text-gray-600 mt-1">Real-time monitoring of network routes</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reliability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost/km
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Shipments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routePerformance.map((route) => {
                const warehouse = warehouses.find(w => w.id === route.fromWarehouseId);
                const distributor = distributors.find(d => d.id === route.toDistributorId);
                
                return (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {warehouse?.name} → {distributor?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {route.distance}km • {route.estimatedTime}h
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(route.currentUtilization)}`}>
                          {route.currentUtilization.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getReliabilityColor(route.reliability)}`}>
                        {route.reliability}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(route.cost / route.distance).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{route.activeShipments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {route.alerts.length > 0 ? (
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-sm text-yellow-700">Alerts</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-700">Operational</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Plans */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Source Plans</h2>
          <p className="text-gray-600 mt-1">AI-generated fulfillment strategies</p>
        </div>
        
        <div className="p-6">
          {sourcePlans.length > 0 ? (
            <div className="space-y-6">
              {sourcePlans.map((plan) => {
                const request = changeRequests.find(r => r.id === plan.requestId);
                const distributor = distributors.find(d => d.id === request?.distributorId);
                
                return (
                  <div key={plan.requestId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Plan for {distributor?.name}
                        </h3>
                        <p className="text-gray-600">Request #{plan.requestId}</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          plan.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plan.approved ? 'Approved' : 'Rejected'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          ${plan.totalCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Total Cost</div>
                        <div className="text-sm text-gray-600 mt-1">
                          ETA: {new Date(plan.deliveryDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {plan.approved && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Source Allocations</h4>
                          <div className="space-y-3">
                            {plan.sources.map((source, index) => {
                              const warehouse = warehouses.find(w => w.id === source.warehouseId);
                              const route = routes.find(r => r.id === source.routeId);
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {warehouse?.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {source.quantity} units via Route {route?.id}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                      ${source.cost.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {new Date(source.estimatedDelivery).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                          <div className={`p-4 rounded-lg border ${
                            plan.riskAssessment.level === 'low' ? 'bg-green-50 border-green-200' :
                            plan.riskAssessment.level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                plan.riskAssessment.level === 'low' ? 'bg-green-500' :
                                plan.riskAssessment.level === 'medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className={`text-sm font-medium capitalize ${
                                plan.riskAssessment.level === 'low' ? 'text-green-800' :
                                plan.riskAssessment.level === 'medium' ? 'text-yellow-800' :
                                'text-red-800'
                              }`}>
                                {plan.riskAssessment.level} Risk
                              </span>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {plan.riskAssessment.factors.map((factor, index) => (
                                <li key={index}>• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {!plan.approved && plan.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-red-800 mb-1">Rejection Reason</h5>
                            <p className="text-sm text-red-700">{plan.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active source plans</h3>
              <p className="text-gray-500">Source plans will appear here when change requests are processed</p>
            </div>
          )}
        </div>
      </div>

      {/* Network Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">San Francisco Bay Area Network</h2>
          <p className="text-gray-600 mt-1">Distribution network across the Bay Area</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 relative overflow-hidden">
            {/* Bay Area Network Visualization */}
            <div className="absolute inset-0 p-6">
              {/* Warehouses */}
              {warehouses.map((warehouse, index) => {
                const positions = [
                  { top: '15%', left: '20%' }, // Petaluma
                  { top: '45%', left: '35%' }, // Oakland
                  { top: '25%', left: '65%' }, // Sacramento
                  { top: '70%', left: '40%' }  // San Jose
                ];
                
                return (
                  <div 
                    key={warehouse.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={positions[index]}
                  >
                    <div className="bg-blue-600 p-3 rounded-lg shadow-lg text-white text-center min-w-24">
                      <div className="text-xs font-medium mb-1">
                        {warehouse.type === 'factory' ? '🏭' : '📦'}
                      </div>
                      <div className="text-xs font-semibold">{warehouse.name.split(' ')[0]}</div>
                      <div className="text-xs opacity-80">{warehouse.location.city}</div>
                    </div>
                  </div>
                );
              })}

              {/* Distributors */}
              {distributors.map((distributor, index) => {
                const positions = [
                  { top: '50%', left: '45%' }, // Bay Area Premium
                  { top: '60%', left: '50%' }, // Golden Gate
                  { top: '55%', left: '40%' }, // Silicon Valley
                  { top: '45%', left: '55%' }  // North Bay
                ];
                
                return (
                  <div 
                    key={distributor.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={positions[index]}
                  >
                    <div className="bg-green-600 p-2 rounded-lg shadow-lg text-white text-center min-w-20">
                      <div className="text-xs font-medium mb-1">🏪</div>
                      <div className="text-xs font-semibold">{distributor.name.split(' ')[0]}</div>
                      <div className="text-xs opacity-80">SF</div>
                    </div>
                  </div>
                );
              })}

              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Sample route lines */}
                <line x1="20%" y1="15%" x2="45%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                <line x1="35%" y1="45%" x2="50%" y2="60%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                <line x1="65%" y1="25%" x2="40%" y2="55%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                <line x1="40%" y1="70%" x2="55%" y2="45%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Network Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Warehouses & Factories</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span>Distributors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-0.5 bg-gray-400" style={{borderStyle: 'dashed'}}></div>
                    <span>Active Routes</span>
                  </div>
                </div>
              </div>

              {/* Network Stats */}
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Network Stats</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Coverage Area:</span>
                    <span className="font-medium">Bay Area</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Routes:</span>
                    <span className="font-medium">{routes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Distance:</span>
                    <span className="font-medium">{(routes.reduce((sum, r) => sum + r.distance, 0) / routes.length).toFixed(0)}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Capacity:</span>
                    <span className="font-medium">{(routes.reduce((sum, r) => sum + r.capacity, 0) / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Status */}
      {isOptimizingRoutes && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <Navigation className="h-5 w-5 animate-spin" />
          <span>Optimizing routes using AI algorithms...</span>
        </div>
      )}
    </div>
  );
}
