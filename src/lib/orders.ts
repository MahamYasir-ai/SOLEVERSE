import { CustomerDetails, DeliveryMethod, Order, OrderPricing, OrderStatus, OrderStatusMilestone, PaymentMethod } from '../types';
import { PRODUCTS } from '../data/products';

export function generateOrderId(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SV-PK-${random}`;
}

export function generateTrackingNumber(): string {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `TRX-${random}`;
}

export function generateComplaintId(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${random}`;
}

export function buildOrderMilestones(status: OrderStatus, createdAtDate: string = new Date().toISOString()): OrderStatusMilestone[] {
  const dateObj = new Date(createdAtDate);
  const formatDate = (daysAhead: number) => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + daysAhead);
    return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusOrder: OrderStatus[] = [
    'placed',
    'confirmed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
  ];

  const currentIndex = statusOrder.indexOf(status);

  return [
    {
      status: 'placed',
      label: 'Order Placed',
      date: formatDate(0),
      description: 'Your order has been recorded in the local demo database.',
      completed: currentIndex >= 0,
      current: status === 'placed',
    },
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      date: formatDate(0.1),
      description: 'Delivery address and contact verified for Pakistani courier dispatch.',
      completed: currentIndex >= 1,
      current: status === 'confirmed',
    },
    {
      status: 'processing',
      label: 'Quality Check & Packing',
      date: formatDate(0.5),
      description: 'Sneakers boxed in protective double-walled carton at Karachi Fulfillment Hub.',
      completed: currentIndex >= 2,
      current: status === 'processing',
    },
    {
      status: 'shipped',
      label: 'Handed to Trax/TCS Express',
      date: formatDate(1),
      description: 'Consignment booked and en route to local delivery station.',
      completed: currentIndex >= 3,
      current: status === 'shipped',
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Doorstep Delivery',
      date: formatDate(2),
      description: 'Courier rider is out for delivery. Keep cash ready if using COD.',
      completed: currentIndex >= 4,
      current: status === 'out_for_delivery',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      date: formatDate(3),
      description: 'Package successfully delivered and signed by customer.',
      completed: currentIndex >= 5,
      current: status === 'delivered',
    },
  ];
}

/**
 * Seed initial realistic demo orders for instant testing of Order Tracking & My Orders.
 */
export const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'SV-PK-782914',
    trackingNumber: 'TRX-84920194',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    status: 'shipped',
    courierName: 'Trax Logistics Pakistan',
    estimatedDeliveryDate: 'Tomorrow by 5:00 PM',
    items: [
      {
        id: 'sv-001-Multiverse Neon (Lime/Pink/Plum)-42',
        productId: 'sv-001',
        product: PRODUCTS[0],
        selectedColor: 'Multiverse Neon (Lime/Pink/Plum)',
        selectedSize: 42,
        quantity: 1,
        unitPrice: 24900,
      },
    ],
    customer: {
      fullName: 'Hamza Tariq',
      email: 'hamza.tariq@gmail.com',
      phone: '03001234567',
      address: 'House 42-B, Street 14, Sector F-8/3',
      city: 'Islamabad',
      area: 'Sector F-8',
      postalCode: '44000',
      deliveryInstructions: 'Please call before ringing gate bell.',
    },
    deliveryMethod: {
      id: 'express',
      name: 'Express Air Courier',
      estimatedDays: '1–2 Business Days Priority Dispatch',
      price: 850,
    },
    paymentMethod: {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      badge: 'COD Verified',
      description: 'Pay cash upon arrival',
    },
    pricing: {
      subtotal: 24900,
      discount: 2490,
      discountCode: 'SOLE10',
      shipping: 0,
      total: 22410,
    },
    milestones: buildOrderMilestones('shipped', new Date(Date.now() - 36 * 3600 * 1000).toISOString()),
  },
  {
    id: 'SV-PK-521903',
    trackingNumber: 'TCS-91823014',
    createdAt: new Date(Date.now() - 90 * 3600 * 1000).toISOString(),
    status: 'delivered',
    courierName: 'TCS Courier Express',
    estimatedDeliveryDate: 'Delivered',
    items: [
      {
        id: 'sv-025-Triple Chalk White-41',
        productId: 'sv-025',
        product: PRODUCTS.find(p => p.id === 'sv-025') || PRODUCTS[1],
        selectedColor: 'Triple Chalk White',
        selectedSize: 41,
        quantity: 1,
        unitPrice: 16900,
      },
    ],
    customer: {
      fullName: 'Maham Tehreem',
      email: 'mahamtehreem45@gmail.com',
      phone: '03219876543',
      address: 'Apartment 402, Ocean Towers, Block 2 Clifton',
      city: 'Karachi',
      area: 'Clifton',
      postalCode: '75500',
    },
    deliveryMethod: {
      id: 'standard',
      name: 'Standard Courier',
      estimatedDays: '3–4 Business Days',
      price: 0,
    },
    paymentMethod: {
      id: 'jazzcash_demo',
      name: 'JazzCash Demo Wallet',
      badge: 'Demo Paid',
      description: 'Paid via simulated wallet',
    },
    pricing: {
      subtotal: 16900,
      discount: 0,
      shipping: 0,
      total: 16900,
    },
    milestones: buildOrderMilestones('delivered', new Date(Date.now() - 90 * 3600 * 1000).toISOString()),
  },
];
