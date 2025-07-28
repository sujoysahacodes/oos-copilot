'use client';

import { 
  BarChart3, 
  FileText, 
  Brain, 
  Route,
  Home,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { useState } from 'react';

interface DistributionSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DistributionSidebar({ activeSection, setActiveSection }: DistributionSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Distribution Overview', icon: Home },
    { id: 'requests', label: 'Request Processor', icon: FileText },
    { id: 'demand', label: 'Demand Intelligence', icon: Brain },
    { id: 'network', label: 'Network Optimizer', icon: Route },
  ];

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Distribution OOS</span>
                <p className="text-xs text-gray-600">Copilot</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
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
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
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

        {/* AI Status (when not collapsed) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Engine Active</span>
              </div>
              <p className="text-xs text-green-700 text-center">
                LLM processing requests
              </p>
              <p className="text-xs text-green-600 text-center mt-1">
                ML models optimizing routes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
