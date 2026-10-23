import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Complaint, CustomerDetails, DeliveryMethod, DiscountCode, Order, PaymentMethod, Product } from '../types';
import { DELIVERY_METHODS, PAYMENT_METHODS, PROMO_CODES, STORE_CONFIG } from '../data/config';
import { getFromStorage, saveToStorage } from '../lib/storage';
import { buildOrderMilestones, generateComplaintId, generateOrderId, generateTrackingNumber, INITIAL_DEMO_ORDERS } from '../lib/orders';
import { PRODUCTS } from '../data/products';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: number, color?: string, quantity?: number) => boolean;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingProgress: {
    threshold: number;
    current: number;
    remaining: number;
    isQualified: boolean;
    percentage: number;
  };
  appliedPromo: DiscountCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistProducts: Product[];

  // Recently Viewed
  recentlyViewedIds: string[];
  addToRecentlyViewed: (productId: string) => void;
  recentlyViewedProducts: Product[];

  // Orders
  orders: Order[];
  createOrder: (
    customer: CustomerDetails,
    deliveryMethod: DeliveryMethod,
    paymentMethod: PaymentMethod,
    deliveryInstructions?: string
  ) => Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  findOrderByPhoneOrEmail: (orderId: string, phoneOrEmail: string) => Order | null;

  // Complaints
  complaints: Complaint[];
  fileComplaint: (
    category: Complaint['category'],
    description: string,
    fullName: string,
    phone: string,
    preferredResolution: Complaint['preferredResolution'],
    orderNumber?: string
  ) => Complaint;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Products
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'soleverse_cart_v2',
  WISHLIST: 'soleverse_wishlist_v2',
  RECENTLY_VIEWED: 'soleverse_recently_viewed_v2',
  ORDERS: 'soleverse_orders_v2',
  COMPLAINTS: 'soleverse_complaints_v2',
  PROMO: 'soleverse_promo_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<DiscountCode | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from LocalStorage safely after mount to avoid hydration mismatch
  useEffect(() => {
    const storedCart = getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    const storedWishlist = getFromStorage<string[]>(STORAGE_KEYS.WISHLIST, ['sv-001', 'sv-002']);
    const storedRecent = getFromStorage<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, ['sv-001', 'sv-025', 'sv-013']);
    const storedOrders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_DEMO_ORDERS);
    const storedComplaints = getFromStorage<Complaint[]>(STORAGE_KEYS.COMPLAINTS, []);
    const storedPromo = getFromStorage<DiscountCode | null>(STORAGE_KEYS.PROMO, null);

    setCart(storedCart);
    setWishlist(storedWishlist);
    setRecentlyViewedIds(storedRecent);
    setOrders(storedOrders.length > 0 ? storedOrders : INITIAL_DEMO_ORDERS);
    setComplaints(storedComplaints);
    setAppliedPromo(storedPromo);
    setIsHydrated(true);
  }, []);

  // Sync state changes to storage
  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEYS.CART, cart);
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewedIds);
  }, [recentlyViewedIds, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEYS.COMPLAINTS, complaints);
  }, [complaints, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEYS.PROMO, appliedPromo);
  }, [appliedPromo, isHydrated]);

  const addToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, size: number, color?: string, quantity: number = 1): boolean => {
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Standard';
    const availableStockForSize = product.stockPerSize[size] ?? 5;

    if (availableStockForSize <= 0) {
      addToast(`Size EU ${size} is currently out of stock for this pair.`, 'warning');
      return false;
    }

    const itemId = `${product.id}-${selectedColor}-${size}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId);
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > availableStockForSize) {
          addToast(`Maximum demo stock reached (${availableStockForSize} pairs available).`, 'warning');
          return prevCart;
        }
        addToast(`Updated quantity in cart (${newQty} pairs).`, 'success');
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > availableStockForSize) {
          addToast(`Only ${availableStockForSize} pairs available in this size.`, 'warning');
          return prevCart;
        }
        addToast(`Added ${product.name} (EU ${size}) to cart!`, 'success');
        return [
          ...prevCart,
          {
            id: itemId,
            productId: product.id,
            product,
            selectedColor,
            selectedSize: size,
            quantity,
            unitPrice: product.price,
          },
        ];
      }
    });

    setIsMiniCartOpen(true);
    return true;
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        addToast(`Removed ${item.product.name} from cart.`, 'info');
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.product.stockPerSize[item.selectedSize] ?? 10;
          const cappedQty = Math.min(quantity, maxStock);
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast('Shopping cart cleared.', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isSaved = prev.includes(productId);
      const product = PRODUCTS.find((p) => p.id === productId);
      const title = product?.name || 'Sneaker';

      if (isSaved) {
        addToast(`Removed ${title} from saved soles.`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast(`Added ${title} to your wishlist!`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrder) {
    if (appliedPromo.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }

  // Shipping calculation (free over threshold)
  const isFreeShipping = subtotal >= STORE_CONFIG.freeShippingThreshold || subtotal === 0;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : STORE_CONFIG.standardShippingRate;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const freeShippingProgress = {
    threshold: STORE_CONFIG.freeShippingThreshold,
    current: subtotal,
    remaining: Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal),
    isQualified: subtotal >= STORE_CONFIG.freeShippingThreshold,
    percentage: Math.min(100, Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100)),
  };

  const applyPromoCode = (inputCode: string) => {
    const code = inputCode.trim().toUpperCase();
    const promo = PROMO_CODES[code];
    if (!promo) {
      return { success: false, message: `Invalid code "${code}". Try "SOLE10" for 10% off.` };
    }
    if (subtotal < promo.minOrder) {
      return {
        success: false,
        message: `Code "${code}" requires a minimum cart value of PKR ${promo.minOrder.toLocaleString()}.`,
      };
    }
    setAppliedPromo(promo);
    addToast(`Promo code "${code}" applied successfully!`, 'success');
    return { success: true, message: promo.description };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast('Promo code removed.', 'info');
  };

  // Order creation
  const createOrder = (
    customer: CustomerDetails,
    deliveryMethod: DeliveryMethod = DELIVERY_METHODS[0],
    paymentMethod: PaymentMethod = PAYMENT_METHODS[0],
    deliveryInstructions?: string
  ): Order | null => {
    if (cart.length === 0) {
      addToast('Cannot checkout with an empty cart.', 'warning');
      return null;
    }

    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber();
    const finalShipping = subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : deliveryMethod.price;
    const finalTotal = Math.max(0, subtotal - discountAmount + finalShipping);

    const newOrder: Order = {
      id: orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
      status: 'placed',
      courierName: deliveryMethod.id === 'express' ? 'Trax Air Express Pakistan' : 'TCS / Trax Standard',
      estimatedDeliveryDate: deliveryMethod.id === 'express' ? '1–2 Business Days' : '3–4 Business Days',
      items: [...cart],
      customer: {
        ...customer,
        deliveryInstructions: deliveryInstructions || customer.deliveryInstructions,
      },
      deliveryMethod: {
        ...deliveryMethod,
        price: finalShipping,
      },
      paymentMethod,
      pricing: {
        subtotal,
        discount: discountAmount,
        discountCode: appliedPromo?.code,
        shipping: finalShipping,
        total: finalTotal,
      },
      milestones: buildOrderMilestones('placed'),
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Clear cart upon successful order
    setCart([]);
    setAppliedPromo(null);
    addToast(`Order ${orderId} created successfully!`, 'success');
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId
    );
  };

  const findOrderByPhoneOrEmail = (orderId: string, phoneOrEmail: string): Order | null => {
    const cleanId = orderId.trim().toUpperCase();
    const cleanLookup = phoneOrEmail.replace(/[\s\-\+]/g, '').toLowerCase();

    const order = orders.find((o) => {
      const matchId = o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId;
      if (!matchId) return false;

      const orderPhoneClean = o.customer.phone.replace(/[\s\-\+]/g, '').toLowerCase();
      const orderEmailClean = o.customer.email.trim().toLowerCase();

      return (
        orderPhoneClean.includes(cleanLookup) ||
        cleanLookup.includes(orderPhoneClean) ||
        orderEmailClean === cleanLookup
      );
    });

    return order || null;
  };

  const fileComplaint = (
    category: Complaint['category'],
    description: string,
    fullName: string,
    phone: string,
    preferredResolution: Complaint['preferredResolution'],
    orderNumber?: string
  ): Complaint => {
    const newComplaint: Complaint = {
      id: generateComplaintId(),
      category,
      orderNumber,
      description,
      fullName,
      phone,
      preferredResolution,
      createdAt: new Date().toISOString(),
      status: 'Received (Demo)',
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    addToast(`Complaint submitted! Reference #${newComplaint.id}`, 'success');
    return newComplaint;
  };

  const wishlistProducts = wishlist
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const getProductBySlug = (slug: string) => {
    return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingProgress,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        isMiniCartOpen,
        setIsMiniCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistProducts,
        recentlyViewedIds,
        addToRecentlyViewed,
        recentlyViewedProducts,
        orders,
        createOrder,
        getOrderById,
        findOrderByPhoneOrEmail,
        complaints,
        fileComplaint,
        toasts,
        addToast,
        removeToast,
        products: PRODUCTS,
        getProductBySlug,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
