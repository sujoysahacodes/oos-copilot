'use client';

import { useEffect } from 'react';
import { useOOSStore } from '@/stores/oosStore';
import { AlertTriangle, Clock, User, CheckCircle } from 'lucide-react';

export function AlertsPanel() {
  const {
    alerts,
    fetchAlerts,
    markAlertAsRead,
    acknowledgeAlert,
    isLoadingAlerts,
  } = useOOSStore();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleMarkAsRead = (alertId: string) => {
    markAlertAsRead(alertId);
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, 'current-user-id'); // Replace with actual user ID
  };

  if (isLoadingAlerts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {alerts.filter(a => !a.isRead).length} unread alerts
          </span>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Configure Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
              alert.severity === 'critical' ? 'border-l-red-500' :
              alert.severity === 'high' ? 'border-l-orange-500' :
              alert.severity === 'medium' ? 'border-l-yellow-500' :
              'border-l-blue-500'
            } ${!alert.isRead ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mt-1">{alert.message}</p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                    {alert.isAcknowledged && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Acknowledged by {alert.acknowledgedBy}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!alert.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mark Read
                  </button>
                )}
                {!alert.isAcknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.isAcknowledged && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
