'use client';

import { 
  BarChart3, 
  Store, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'stores', label: 'Store Map', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">OOS</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Stats Summary (when not collapsed) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Today's Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Alerts</span>
                  <span className="text-xs font-medium text-red-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">OOS Products</span>
                  <span className="text-xs font-medium text-orange-600">87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Stores Monitored</span>
                  <span className="text-xs font-medium text-green-600">245</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
