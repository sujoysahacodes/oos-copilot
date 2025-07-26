import { NextRequest, NextResponse } from 'next/server';

// Mock alerts data
const mockAlerts = [
  {
    id: 'alert-1',
    type: 'stockout',
    severity: 'critical',
    title: 'Critical Stock Out - Premium Coffee Beans',
    message: 'Premium Coffee Beans (COF-001) is completely out of stock at Downtown Main Store. Immediate restocking required.',
    productId: '1',
    storeId: 'store-1',
    timestamp: new Date('2024-01-25T10:30:00Z'),
    isRead: false,
    isAcknowledged: false,
    actions: [
      {
        id: 'action-1',
        label: 'Contact Supplier',
        type: 'contact_supplier',
        isCompleted: false
      },
      {
        id: 'action-2',
        label: 'Transfer from Other Store',
        type: 'transfer',
        isCompleted: false
      }
    ],
    priority: 1
  },
  {
    id: 'alert-2',
    type: 'low_stock',
    severity: 'high',
    title: 'Low Stock Warning - Organic Milk',
    message: 'Organic Milk (MLK-002) is running low at Downtown Main Store. Current stock: 25 units, minimum threshold: 100 units.',
    productId: '2',
    storeId: 'store-1',
    timestamp: new Date('2024-01-25T09:15:00Z'),
    isRead: true,
    isAcknowledged: false,
    actions: [
      {
        id: 'action-3',
        label: 'Schedule Reorder',
        type: 'reorder',
        isCompleted: false
      }
    ],
    priority: 2
  },
  {
    id: 'alert-3',
    type: 'predicted_stockout',
    severity: 'medium',
    title: 'Predicted Stock Out - Fresh Apples',
    message: 'AI forecast predicts Fresh Apples (APL-004) will be out of stock within 2 days at current consumption rate.',
    productId: '4',
    storeId: 'store-1',
    timestamp: new Date('2024-01-25T08:45:00Z'),
    isRead: false,
    isAcknowledged: true,
    acknowledgedBy: 'alice.johnson@company.com',
    acknowledgedAt: new Date('2024-01-25T09:00:00Z'),
    actions: [
      {
        id: 'action-4',
        label: 'Update Forecast',
        type: 'update_forecast',
        isCompleted: true,
        completedAt: new Date('2024-01-25T09:30:00Z'),
        completedBy: 'alice.johnson@company.com'
      }
    ],
    priority: 3
  },
  {
    id: 'alert-4',
    type: 'supplier_delay',
    severity: 'high',
    title: 'Supplier Delay - Bakery Partners',
    message: 'Bakery Partners has reported a 2-day delay in delivery. This may affect bread products across multiple stores.',
    storeId: 'store-1',
    timestamp: new Date('2024-01-25T07:20:00Z'),
    isRead: true,
    isAcknowledged: true,
    acknowledgedBy: 'manager@company.com',
    acknowledgedAt: new Date('2024-01-25T08:00:00Z'),
    actions: [
      {
        id: 'action-5',
        label: 'Notify Store Managers',
        type: 'notify_manager',
        isCompleted: true,
        completedAt: new Date('2024-01-25T08:15:00Z'),
        completedBy: 'manager@company.com'
      },
      {
        id: 'action-6',
        label: 'Find Alternative Supplier',
        type: 'contact_supplier',
        isCompleted: false
      }
    ],
    priority: 2
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchParams = request.nextUrl.searchParams;
    const severity = searchParams.get('severity');
    const unreadOnly = searchParams.get('unread');
    const storeId = searchParams.get('storeId');
    
    let filteredAlerts = [...mockAlerts];
    
    if (severity) {
      filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
    }
    
    if (unreadOnly === 'true') {
      filteredAlerts = filteredAlerts.filter(a => !a.isRead);
    }
    
    if (storeId) {
      filteredAlerts = filteredAlerts.filter(a => a.storeId === storeId);
    }
    
    // Sort by priority and timestamp
    filteredAlerts.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return NextResponse.json(filteredAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const alert = await request.json();
    
    // Validate required fields
    if (!alert.type || !alert.severity || !alert.title || !alert.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, this would save to the database
    const newAlert = {
      id: Math.random().toString(36).substr(2, 9),
      ...alert,
      timestamp: new Date(),
      isRead: false,
      isAcknowledged: false,
      actions: alert.actions || [],
    };
    
    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
