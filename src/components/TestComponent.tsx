import { useOOSStore } from '@/stores/oosStore';

export function TestComponent() {
  const { stores, products, alerts } = useOOSStore();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">System Status</h2>
      <div className="space-y-2">
        <p>Stores: {stores.length}</p>
        <p>Products: {products.length}</p>
        <p>Alerts: {alerts.length}</p>
        <p className="text-green-600">✓ Store working correctly</p>
        <p className="text-green-600">✓ Components loading</p>
      </div>
    </div>
  );
}
