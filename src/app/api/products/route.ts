import { NextRequest, NextResponse } from 'next/server';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    sku: 'COF-001',
    category: 'Beverages',
    brand: 'AcmeCorp',
    description: 'Premium Arabica coffee beans',
    price: 12.99,
    minStockLevel: 50,
    maxStockLevel: 200,
    currentStock: 5,
    isOutOfStock: true,
    lastRestocked: new Date('2024-01-20'),
    supplier: {
      id: 'sup-1',
      name: 'Coffee Suppliers Inc.',
      contactPerson: 'John Smith',
      phone: '+1-555-0123',
      email: 'john@coffeesuppliers.com',
      deliveryTime: 3,
      reliability: 0.95,
    }
  },
  {
    id: '2',
    name: 'Organic Milk',
    sku: 'MLK-002',
    category: 'Dairy',
    brand: 'FreshFarms',
    description: 'Organic whole milk',
    price: 4.99,
    minStockLevel: 100,
    maxStockLevel: 500,
    currentStock: 25,
    isOutOfStock: false,
    lastRestocked: new Date('2024-01-22'),
    supplier: {
      id: 'sup-2',
      name: 'Dairy Direct',
      contactPerson: 'Mary Johnson',
      phone: '+1-555-0456',
      email: 'mary@dairydirect.com',
      deliveryTime: 1,
      reliability: 0.98,
    }
  },
  {
    id: '3',
    name: 'Whole Grain Bread',
    sku: 'BRD-003',
    category: 'Bakery',
    brand: 'GoldenBake',
    description: 'Fresh whole grain bread',
    price: 3.49,
    minStockLevel: 30,
    maxStockLevel: 150,
    currentStock: 0,
    isOutOfStock: true,
    lastRestocked: new Date('2024-01-19'),
    supplier: {
      id: 'sup-3',
      name: 'Bakery Partners',
      contactPerson: 'Tom Wilson',
      phone: '+1-555-0789',
      email: 'tom@bakerypartners.com',
      deliveryTime: 2,
      reliability: 0.92,
    }
  },
  {
    id: '4',
    name: 'Fresh Apples',
    sku: 'APL-004',
    category: 'Produce',
    brand: 'OrchardFresh',
    description: 'Crisp red apples',
    price: 2.99,
    minStockLevel: 80,
    maxStockLevel: 300,
    currentStock: 15,
    isOutOfStock: false,
    lastRestocked: new Date('2024-01-21'),
    supplier: {
      id: 'sup-4',
      name: 'Fresh Produce Co.',
      contactPerson: 'Lisa Brown',
      phone: '+1-555-0321',
      email: 'lisa@freshproduce.com',
      deliveryTime: 1,
      reliability: 0.89,
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const outOfStock = searchParams.get('outOfStock');
    
    let filteredProducts = mockProducts;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (outOfStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isOutOfStock);
    }
    
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    
    // Validate required fields
    if (!product.name || !product.sku || !product.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, this would save to the database
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...product,
      isOutOfStock: product.currentStock === 0,
      lastRestocked: new Date(),
    };
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
