export type CategorySlug = 
  | 'chunky-sneakers'
  | 'retro-runners'
  | 'basketball'
  | 'skate-culture'
  | 'futuristic-kicks'
  | 'everyday-essentials'
  | 'platform-sneakers'
  | 'limited-editions';

export type VibeType = 
  | 'Main Character Energy'
  | 'Clean Girl / Clean Boy'
  | 'Street Mode'
  | 'Futurecore';

export type Gender = 'Men' | 'Women' | 'Unisex';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Review {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedDemoPurchase: boolean;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  categoryLabel: string;
  collection: string;
  description: string;
  details: string[];
  materials: string;
  care: string;
  price: number; // in PKR
  compareAtPrice?: number; // original price in PKR for sale
  images: string[];
  colors: ProductColor[];
  availableSizes: number[]; // e.g. [38, 39, 40, 41, 42, 43, 44, 45]
  stockPerSize: Record<number, number>; // size -> quantity in stock
  totalStock: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  gender: Gender;
  vibe: VibeType;
  reviews?: Review[];
}

export interface CartItem {
  id: string; // unique item composite key: `${productId}-${color}-${size}`
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: number;
  quantity: number;
  unitPrice: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // 10 for 10%, or 500 for PKR 500
  minOrder: number;
  description: string;
}

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered';

export interface OrderStatusMilestone {
  status: OrderStatus;
  label: string;
  date: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export type DeliveryMethodId = 'standard' | 'express';

export interface DeliveryMethod {
  id: DeliveryMethodId;
  name: string;
  estimatedDays: string;
  price: number;
}

export type PaymentMethodId = 'cod' | 'jazzcash_demo' | 'easypaisa_demo' | 'bank_transfer_demo' | 'card_demo';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  badge: string;
  description: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  total: number;
}

export interface Order {
  id: string; // e.g. SV-PK-849201
  trackingNumber: string;
  createdAt: string;
  status: OrderStatus;
  courierName: string;
  estimatedDeliveryDate: string;
  items: CartItem[];
  customer: CustomerDetails;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  pricing: OrderPricing;
  milestones: OrderStatusMilestone[];
  notes?: string;
}

export interface Complaint {
  id: string; // e.g. TKT-9831
  category: 'Damaged item' | 'Wrong size' | 'Delivery delay' | 'Quality issue' | 'Other';
  orderNumber?: string;
  description: string;
  fullName: string;
  phone: string;
  preferredResolution: 'Replacement' | 'Store Credit' | 'Exchange' | 'Manager Callback';
  createdAt: string;
  status: 'Received (Demo)' | 'Under Review (Demo)' | 'Resolved (Demo)';
}

export interface FilterState {
  category?: CategorySlug | 'all';
  gender?: Gender | 'all';
  vibe?: VibeType | 'all';
  priceRange?: [number, number];
  size?: number | null;
  color?: string | null;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  newOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating' | 'best-selling';
}
