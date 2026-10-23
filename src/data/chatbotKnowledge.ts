import { Order, Product } from '../types';
import { formatPKR } from '../lib/currency';
import { STORE_CONFIG } from './config';

export interface ChatbotResponse {
  text: string;
  quickReplies?: string[];
  products?: Product[];
  orderInfo?: Order;
  action?: 'open_complaint_form' | 'show_size_guide' | 'whatsapp_handoff';
}

export function processChatbotQuery(
  input: string,
  allProducts: Product[],
  allOrders: Order[]
): ChatbotResponse {
  const query = input.trim().toLowerCase();

  // 1. Order Tracking by ID (e.g. SV-PK-123456 or 6 digits)
  const orderIdMatch = query.match(/sv-pk-\d{6}/i) || query.match(/\b\d{6}\b/);
  if (orderIdMatch || query.includes('track') || query.includes('order status') || query.includes('kahan hai mera order')) {
    if (orderIdMatch) {
      const searchTarget = orderIdMatch[0].toUpperCase();
      const matchedOrder = allOrders.find(
        (o) => o.id.toUpperCase().includes(searchTarget) || o.trackingNumber.toUpperCase().includes(searchTarget)
      );

      if (matchedOrder) {
        return {
          text: `Found your order *${matchedOrder.id}*! Current status: *${matchedOrder.milestones.find(m => m.current)?.label || matchedOrder.status.toUpperCase()}* via ${matchedOrder.courierName}. Delivery estimate: ${matchedOrder.estimatedDeliveryDate}.`,
          orderInfo: matchedOrder,
          quickReplies: ['Track on full page', 'Inquire via WhatsApp', 'Shop more drops'],
        };
      } else {
        return {
          text: `I couldn't find an order matching "${orderIdMatch[0]}". Please verify your 6-digit Order ID (like SV-PK-782914) or tracking number.`,
          quickReplies: ['Open Order Tracker', 'Talk to Human on WhatsApp', 'Check My Orders'],
        };
      }
    }

    if (allOrders.length > 0) {
      const latestOrder = allOrders[0];
      return {
        text: `You have an active demo order in this session: *${latestOrder.id}* (${latestOrder.status.toUpperCase()}). Type your order number to look up specific details or open our order tracker.`,
        orderInfo: latestOrder,
        quickReplies: [`Track ${latestOrder.id}`, 'Open Order Tracker', 'Help with another order'],
      };
    }

    return {
      text: `To track an order, please send your order number (e.g., *SV-PK-782914*) or click below to use our full Order Tracking portal!`,
      quickReplies: ['Open Order Tracker', 'Need Delivery Timeframes', 'Talk to Support'],
    };
  }

  // 2. Complaint or Problem Filing
  if (
    query.includes('complaint') ||
    query.includes('problem') ||
    query.includes('damaged') ||
    query.includes('wrong size') ||
    query.includes('broken') ||
    query.includes('shikayat') ||
    query.includes('refund') ||
    query.includes('delay')
  ) {
    return {
      text: `I'm really sorry to hear that! We take every delivery seriously. You can file an instant complaint ticket right here or escalate to our management team on WhatsApp.`,
      action: 'open_complaint_form',
      quickReplies: ['File a Complaint Ticket', 'Return Policy Info', 'Chat on WhatsApp'],
    };
  }

  // 3. Discount Codes & Deals
  if (
    query.includes('discount') ||
    query.includes('coupon') ||
    query.includes('promo') ||
    query.includes('code') ||
    query.includes('sale') ||
    query.includes('offer')
  ) {
    return {
      text: `Here are our active demo promo codes:\n\n• *SOLE10* — 10% off on all sneakers (min PKR 5,000)\n• *FIRST500* — PKR 500 flat off your first pair (min PKR 3,000)\n• *DROP20* — 20% off high-voltage heat orders over PKR 25,000\n\nPlus, enjoy *FREE SHIPPING* across Pakistan on all carts over PKR 15,000! 🚚`,
      quickReplies: ['Shop Sale Sneaks', 'View New Drops', 'Check Cart'],
    };
  }

  // 4. Shipping, COD, & Delivery Times in Pakistan
  if (
    query.includes('shipping') ||
    query.includes('delivery') ||
    query.includes('cash on delivery') ||
    query.includes('cod') ||
    query.includes('tcs') ||
    query.includes('charges') ||
    query.includes('how long') ||
    query.includes('days')
  ) {
    return {
      text: `Pakistan Delivery & COD Policy:\n\n• *Cash on Delivery (COD)* is available nationwide!\n• *Standard Delivery:* 3–4 business days (PKR 450 flat, or *FREE* on orders PKR 15,000+)\n• *Express Air Courier:* 1–2 business days priority dispatch (PKR 850)\n• Dispatched from our central Karachi hub with Trax and TCS Logistics.`,
      quickReplies: ['Explore Sneakers', 'Payment Methods', 'Track My Order'],
    };
  }

  // 5. Size Guide & Fit Advice
  if (
    query.includes('size') ||
    query.includes('fit') ||
    query.includes('sizing') ||
    query.includes('measure') ||
    query.includes('cm') ||
    query.includes('eu') ||
    query.includes('uk')
  ) {
    return {
      text: `Most SOLEVERSE sneakers fit *True to Size (TTS)* in European sizing (EU 38–46). If you have wider feet or are picking up our chunky platform sneakers, we recommend going half-a-size or one size up for maximum comfort.`,
      action: 'show_size_guide',
      quickReplies: ['Open Size Guide Modal', 'Show Size 42 Shoes', 'Show Size 43 Shoes'],
    };
  }

  // 6. Returns & Exchanges
  if (query.includes('return') || query.includes('exchange') || query.includes('replace')) {
    return {
      text: `We offer a *7-day hassle-free return and exchange guarantee* across Pakistan! Shoes must be unworn with original tags and packaging intact. We arrange courier reverse-pickup from your doorstep.`,
      quickReplies: ['File an Exchange Ticket', 'WhatsApp Exchange Support', 'Browse Sneakers'],
    };
  }

  // 7. Futuristic / Flagship Sneaker Inquiry
  if (
    query.includes('futuristic') ||
    query.includes('valkyrie') ||
    query.includes('chrono') ||
    query.includes('neon') ||
    query.includes('cyber') ||
    query.includes('flagship')
  ) {
    const futuristic = allProducts.filter(
      (p) => p.category === 'futuristic-kicks' || p.category === 'limited-editions' || p.tags.includes('Neon')
    ).slice(0, 3);

    return {
      text: `You're looking for high-voltage heat! Check out our flagship *Valkyrie Chrono-Core 01* with segmented kinetic soles and neon lime overlays:`,
      products: futuristic,
      quickReplies: ['View Valkyrie 01', 'Futuristic Kicks Collection', 'Limited Editions'],
    };
  }

  // 8. Chunky Sneakers
  if (query.includes('chunky') || query.includes('dad shoe') || query.includes('platform')) {
    const chunky = allProducts.filter((p) => p.category === 'chunky-sneakers' || p.category === 'platform-sneakers').slice(0, 3);
    return {
      text: `Here are our top chunky and stacked platform kicks with aggressive streetwear proportions:`,
      products: chunky,
      quickReplies: ['View All Chunky', 'Platform Sneakers', 'Under 18k PKR'],
    };
  }

  // 9. Retro & Vintage
  if (query.includes('retro') || query.includes('runner') || query.includes('vintage') || query.includes('80s') || query.includes('90s')) {
    const retro = allProducts.filter((p) => p.category === 'retro-runners').slice(0, 3);
    return {
      text: `Heritage track DNA and classic gum waffle soles:`,
      products: retro,
      quickReplies: ['View All Retro', 'Echo 84 Trackster', 'Shop Clean Style'],
    };
  }

  // 10. Basketball / High-Tops
  if (query.includes('basketball') || query.includes('high top') || query.includes('court') || query.includes('dunk')) {
    const hoops = allProducts.filter((p) => p.category === 'basketball').slice(0, 3);
    return {
      text: `Hardwood classics and high-top ankle locks:`,
      products: hoops,
      quickReplies: ['View All Basketball', 'Court Dynasty High', 'Under 20k PKR'],
    };
  }

  // 11. Specific Size Inquiries (e.g., "size 42", "size 44")
  const sizeMatch = query.match(/\bsize\s*(\d{2})\b/) || query.match(/\beu\s*(\d{2})\b/);
  if (sizeMatch) {
    const targetSize = parseInt(sizeMatch[1], 10);
    const inStockForSize = allProducts.filter((p) => (p.stockPerSize[targetSize] ?? 0) > 0).slice(0, 3);
    if (inStockForSize.length > 0) {
      return {
        text: `We have great drops in stock for EU size ${targetSize}:`,
        products: inStockForSize,
        quickReplies: [`All Size ${targetSize} Kicks`, 'Check Size Chart', 'Talk to Support'],
      };
    }
  }

  // 12. Budget / Price Inquiries (e.g. "under 15000", "cheap", "affordable")
  if (query.includes('under') || query.includes('budget') || query.includes('affordable') || query.includes('cheap')) {
    const affordable = allProducts.filter((p) => p.price < 15000).sort((a, b) => a.price - b.price).slice(0, 3);
    return {
      text: `Steal deals under PKR 15,000 without sacrificing style:`,
      products: affordable,
      quickReplies: ['Sort Low to High', 'View Everyday Essentials', 'Check Sale Items'],
    };
  }

  // Default fallback with helpful prompts
  return {
    text: `Yo! I'm SOLE BOT, your sneaker copilot 👟 I can help you find kicks by style, check real inventory, track your order (e.g. "SV-PK-782914"), answer Pakistan delivery questions, or file a support ticket.`,
    quickReplies: [
      'Track My Order',
      'Futuristic Neon Kicks',
      'Chunky Sneakers',
      'Discount Codes',
      'COD & Shipping Info',
      'Chat on WhatsApp',
    ],
  };
}
