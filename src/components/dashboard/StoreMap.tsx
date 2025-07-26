'use client';

import { useEffect, useState } from 'react';
import { useOOSStore } from '@/stores/oosStore';
import { 
  MapPin, 
  RefreshCw, 
  Store as StoreIcon, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Package
} from 'lucide-react';

export function StoreMap() {
  const { stores, fetchStores, isLoadingStores } = useOOSStore();
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStores();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStoreStatusColor = (store) => {
    if (store.oosPercentage > 3) return 'bg-red-500';
    if (store.oosPercentage > 2) return 'bg-orange-500';
    if (store.oosPercentage > 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStoreStatusText = (store) => {
    if (store.oosPercentage > 3) return 'Critical';
    if (store.oosPercentage > 2) return 'High Alert';
    if (store.oosPercentage > 1) return 'Warning';
    return 'Normal';
  };

  if (isLoadingStores) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Store Map</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Map</h1>
          <p className="text-gray-600 mt-1">Monitor all store locations and their OOS status</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'map' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Map View
            </button>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Map
          </button>
        </div>
      </div>

      {/* Store Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
            </div>
            <StoreIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Normal Status</p>
              <p className="text-2xl font-bold text-green-600">
                {stores.filter(s => s.oosPercentage <= 1).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Need Attention</p>
              <p className="text-2xl font-bold text-orange-600">
                {stores.filter(s => s.oosPercentage > 1 && s.oosPercentage <= 3).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">
                {stores.filter(s => s.oosPercentage > 3).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'map' ? (
          /* Map View - Simulated Geographic Layout */
          <div className="p-6">
            <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 p-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Store Locations</h3>
                
                {stores.map((store, index) => (
                  <div
                    key={store.id}
                    className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + (index * 25) % 60}%`,
                      top: `${30 + (index * 15) % 40}%`,
                    }}
                    onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
                  >
                    <div className="relative">
                      <MapPin className={`h-8 w-8 ${getStoreStatusColor(store)} text-white rounded-full p-1 shadow-lg`} />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStoreStatusColor(store)} rounded-full animate-pulse`}></div>
                    </div>
                    
                    {selectedStore?.id === store.id && (
                      <div className="absolute top-10 left-0 bg-white rounded-lg shadow-lg p-4 min-w-64 z-10 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">{store.name}</h4>
                        <p className="text-sm text-gray-600">{store.code}</p>
                        <p className="text-xs text-gray-500 mt-1">{store.address.street}, {store.address.city}</p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>OOS Rate:</span>
                            <span className={`font-medium ${
                              store.oosPercentage > 3 ? 'text-red-600' :
                              store.oosPercentage > 1 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {store.oosPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <span className={`font-medium ${
                              store.oosPercentage > 3 ? 'text-red-600' :
                              store.oosPercentage > 1 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {getStoreStatusText(store)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Products OOS:</span>
                            <span className="text-gray-900">{store.outOfStockProducts}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View - Store Cards */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.code}</p>
                      <p className="text-xs text-gray-500">{store.region}</p>
                    </div>
                    <div className={`w-3 h-3 ${getStoreStatusColor(store)} rounded-full`}></div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Manager:</span>
                      <span className="text-gray-900">{store.manager}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">OOS Rate:</span>
                      <span className={`font-medium ${
                        store.oosPercentage > 3 ? 'text-red-600' :
                        store.oosPercentage > 1 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {store.oosPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <Package className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="text-sm font-semibold">{store.totalProducts}</p>
                    </div>
                    <div className="bg-red-50 rounded p-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mx-auto mb-1" />
                      <p className="text-xs text-red-600">OOS</p>
                      <p className="text-sm font-semibold text-red-600">{store.outOfStockProducts}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-2">
                      <Clock className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-orange-600">Low</p>
                      <p className="text-sm font-semibold text-orange-600">{store.lowStockProducts}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      store.oosPercentage > 3 ? 'bg-red-100 text-red-800' :
                      store.oosPercentage > 1 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {getStoreStatusText(store)}
                    </span>
                    <button className="text-xs text-primary-600 hover:text-primary-800">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
