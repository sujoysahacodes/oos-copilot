import { NextRequest, NextResponse } from 'next/server';

// Mock stores data
const mockStores = [
  {
    id: 'store-1',
    name: 'Downtown Main Store',
    code: 'DT001',
    address: {
      street: '123 Main Street',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    region: 'West Coast',
    district: 'Downtown District',
    manager: 'Alice Johnson',
    phone: '+1-555-1001',
    email: 'alice.johnson@company.com',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    },
    operatingHours: {
      monday: { open: '08:00', close: '22:00', isClosed: false },
      tuesday: { open: '08:00', close: '22:00', isClosed: false },
      wednesday: { open: '08:00', close: '22:00', isClosed: false },
      thursday: { open: '08:00', close: '22:00', isClosed: false },
      friday: { open: '08:00', close: '23:00', isClosed: false },
      saturday: { open: '09:00', close: '23:00', isClosed: false },
      sunday: { open: '10:00', close: '21:00', isClosed: false }
    },
    isActive: true,
    totalProducts: 1250,
    outOfStockProducts: 23,
    lowStockProducts: 45,
    oosPercentage: 1.84
  },
  {
    id: 'store-2',
    name: 'Suburban Plaza',
    code: 'SP002',
    address: {
      street: '456 Oak Avenue',
      city: 'Suburbia',
      state: 'CA',
      zipCode: '90211',
      country: 'USA'
    },
    region: 'West Coast',
    district: 'Suburban District',
    manager: 'Bob Smith',
    phone: '+1-555-1002',
    email: 'bob.smith@company.com',
    coordinates: {
      lat: 34.0722,
      lng: -118.2637
    },
    operatingHours: {
      monday: { open: '07:00', close: '21:00', isClosed: false },
      tuesday: { open: '07:00', close: '21:00', isClosed: false },
      wednesday: { open: '07:00', close: '21:00', isClosed: false },
      thursday: { open: '07:00', close: '21:00', isClosed: false },
      friday: { open: '07:00', close: '22:00', isClosed: false },
      saturday: { open: '08:00', close: '22:00', isClosed: false },
      sunday: { open: '09:00', close: '20:00', isClosed: false }
    },
    isActive: true,
    totalProducts: 980,
    outOfStockProducts: 12,
    lowStockProducts: 28,
    oosPercentage: 1.22
  },
  {
    id: 'store-3',
    name: 'Metro Center',
    code: 'MC003',
    address: {
      street: '789 Metro Boulevard',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90212',
      country: 'USA'
    },
    region: 'West Coast',
    district: 'Metro District',
    manager: 'Carol Davis',
    phone: '+1-555-1003',
    email: 'carol.davis@company.com',
    coordinates: {
      lat: 34.0922,
      lng: -118.2837
    },
    operatingHours: {
      monday: { open: '06:00', close: '24:00', isClosed: false },
      tuesday: { open: '06:00', close: '24:00', isClosed: false },
      wednesday: { open: '06:00', close: '24:00', isClosed: false },
      thursday: { open: '06:00', close: '24:00', isClosed: false },
      friday: { open: '06:00', close: '24:00', isClosed: false },
      saturday: { open: '06:00', close: '24:00', isClosed: false },
      sunday: { open: '06:00', close: '24:00', isClosed: false }
    },
    isActive: true,
    totalProducts: 1500,
    outOfStockProducts: 35,
    lowStockProducts: 67,
    oosPercentage: 2.33
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    const district = searchParams.get('district');
    
    let filteredStores = mockStores;
    
    if (region) {
      filteredStores = filteredStores.filter(s => 
        s.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    if (district) {
      filteredStores = filteredStores.filter(s => 
        s.district.toLowerCase().includes(district.toLowerCase())
      );
    }
    
    return NextResponse.json(filteredStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
