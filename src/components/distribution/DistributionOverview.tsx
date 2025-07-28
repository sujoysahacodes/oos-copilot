'use client';

import { useDistributionOOSStore } from '../../stores/distributionStore';
import { SourcePlan } from '../../types/distribution';
import { Brain, TrendingUp, Package, AlertTriangle, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

export default function DistributionOverview() {
  const {
    changeRequests,
    metrics,
    alerts,
    distributors,
    warehouses,
    products,
    sourcePlans
  } = useDistributionOOSStore();

  const pendingRequests = changeRequests.filter(r => r.status === 'pending').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
  const totalInventoryValue = warehouses.reduce((total, warehouse) => {
    return total + warehouse.currentInventory.reduce((warehouseTotal, item) => {
      const product = products.find(p => p.id === item.productId);
      return warehouseTotal + (item.availableStock * (product?.unitCost || 0));
    }, 0);
  }, 0);

  const lowStockDistributors = distributors.filter(d => 
    d.currentInventory.some(item => item.currentStock <= item.reorderPoint)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distribution Control Center</h1>
          <p className="text-gray-600 mt-1">AI-powered demand fulfillment and inventory optimization</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700 font-medium">AI Engine Active</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingRequests}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Avg Response: {metrics.averageResponseTime}h</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{criticalAlerts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Requires immediate attention</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Fulfillment Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{metrics.fulfillmentRate.toFixed(1)}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+2.3% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Inventory Value</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">${(totalInventoryValue / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Across {warehouses.length} facilities</span>
          </div>
        </div>
      </div>

      {/* Recent Change Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Change Requests</h2>
          <p className="text-gray-600 mt-1">AI-analyzed distributor requests requiring action</p>
        </div>
        <div className="p-6">
          {changeRequests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No change requests at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {changeRequests.slice(0, 3).map((request) => {
                const distributor = distributors.find(d => d.id === request.distributorId);
                const product = products.find(p => p.id === request.requestedChanges[0]?.productId);
                
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.priority.toUpperCase()}
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2">{distributor?.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.requestedChanges[0]?.type} {product?.name} - 
                        {request.requestedChanges[0]?.fromQuantity} → {request.requestedChanges[0]?.toQuantity} units
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence: {(request.interpretedRequest.confidence * 100).toFixed(0)}% | 
                        Impact: ${request.interpretedRequest.estimatedImpact.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Source Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Source Plans</h3>
            <div className="space-y-4">
              {sourcePlans.slice(0, 3).map((plan: SourcePlan) => {
                const request = changeRequests.find(r => r.id === plan.requestId);
                const distributor = distributors.find(d => d.id === request?.distributorId);
                const warehouse = warehouses.find(w => w.id === plan.sources[0]?.warehouseId);
                const product = products.find(p => p.id === plan.sources[0]?.productId);
                
                return (
                  <div key={plan.requestId} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plan.approved ? 'APPROVED' : 'REJECTED'}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.riskAssessment.level === 'low' ? 'bg-green-100 text-green-800' :
                          plan.riskAssessment.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {plan.riskAssessment.level.toUpperCase()} RISK
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        ${plan.totalCost.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">From: </span>
                        <span className="font-medium">{warehouse?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">To: </span>
                        <span className="font-medium">{distributor?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Product: </span>
                        <span className="font-medium">{product?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity: </span>
                        <span className="font-medium">{plan.sources[0]?.quantity} units</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Risk Factors:</span>
                        <ul className="mt-1 space-y-1">
                          {plan.riskAssessment.factors.map((factor: string, index: number) => (
                            <li key={index} className="flex items-center space-x-1">
                              <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      ETA: {plan.deliveryDate.toLocaleDateString()} at {plan.deliveryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
              
              {sourcePlans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No active source plans</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Route Efficiency</span>
                <span className="font-semibold text-green-600">{metrics.routeEfficiency}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost Optimization</span>
                <span className="font-semibold text-blue-600">{metrics.costOptimization}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inventory Turnover</span>
                <span className="font-semibold text-purple-600">{metrics.inventoryTurnover}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold text-orange-600">{metrics.customerSatisfaction}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Distributors</span>
                <span className="font-semibold">{distributors.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Alerts</span>
                <span className="font-semibold text-orange-600">{lowStockDistributors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Operating Warehouses</span>
                <span className="font-semibold">{warehouses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Product Portfolio</span>
                <span className="font-semibold">{products.length} SKUs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
