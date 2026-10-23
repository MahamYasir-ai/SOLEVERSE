import { STORE_CONFIG } from '../data/config';
import { formatPKR } from './currency';
import { Complaint, Order, Product } from '../types';

/**
 * Builds a direct WhatsApp click-to-chat URL with pre-encoded message.
 * Returns URL and configuration status.
 */
export function getWhatsAppChatUrl(message: string, customPhone?: string): { url: string; isConfigured: boolean; phone: string } {
  const phone = (customPhone || STORE_CONFIG.supportWhatsAppNumber || '').replace(/[^0-9]/g, '');
  const isConfigured = Boolean(phone && phone.length >= 10);
  
  if (!isConfigured) {
    return {
      url: '#',
      isConfigured: false,
      phone: '',
    };
  }

  const encoded = encodeURIComponent(message.trim());
  return {
    url: `https://wa.me/${phone}?text=${encoded}`,
    isConfigured: true,
    phone,
  };
}

export function formatProductInquiry(product: Product, selectedSize?: number, selectedColor?: string): string {
  const parts = [
    `Yo SOLEVERSE! 👟 I'm checking out *${product.name}* (SKU: ${product.sku}).`,
    `Price: ${formatPKR(product.price)}`,
  ];
  if (selectedSize) parts.push(`Size checked: EU ${selectedSize}`);
  if (selectedColor) parts.push(`Color: ${selectedColor}`);
  parts.push(`Can you confirm availability and delivery timeframe to my city in Pakistan?`);
  return parts.join('\n');
}

export function formatOrderInquiry(orderId: string, customerName?: string): string {
  return [
    `Hi SOLEVERSE Team! 📦`,
    `I would like to check the status of my order:`,
    `*Order Number:* ${orderId}`,
    customerName ? `*Name:* ${customerName}` : '',
    `Could you please update me on the courier dispatch details? Thanks!`,
  ].filter(Boolean).join('\n');
}

export function formatWhatsAppCheckoutOrder(order: Order): string {
  const itemLines = order.items.map(
    (item, index) =>
      `${index + 1}. *${item.product.name}* (EU ${item.selectedSize}, ${item.selectedColor}) × ${item.quantity} = ${formatPKR(item.unitPrice * item.quantity)}`
  );

  return [
    `👟 *SOLEVERSE DEMO ORDER CONFIRMATION*`,
    `--------------------------------------`,
    `*Order ID:* ${order.id}`,
    `*Customer:* ${order.customer.fullName}`,
    `*Phone:* ${order.customer.phone}`,
    `*Address:* ${order.customer.address}, ${order.customer.area}, ${order.customer.city}`,
    `--------------------------------------`,
    `*ITEMS:*`,
    ...itemLines,
    `--------------------------------------`,
    `*Subtotal:* ${formatPKR(order.pricing.subtotal)}`,
    order.pricing.discount > 0 ? `*Discount (${order.pricing.discountCode || 'Promo'}):* -${formatPKR(order.pricing.discount)}` : '',
    `*Shipping (${order.deliveryMethod.name}):* ${order.pricing.shipping === 0 ? 'FREE' : formatPKR(order.pricing.shipping)}`,
    `*FINAL TOTAL:* ${formatPKR(order.pricing.total)}`,
    `*Payment Mode:* ${order.paymentMethod.name}`,
    `--------------------------------------`,
    `Please confirm my order for dispatch!`,
  ].filter(Boolean).join('\n');
}

export function formatComplaintWhatsApp(complaint: Complaint): string {
  return [
    `⚠️ *SOLEVERSE SUPPORT & COMPLAINT TICKET*`,
    `*Ticket Ref:* ${complaint.id}`,
    complaint.orderNumber ? `*Related Order:* ${complaint.orderNumber}` : '',
    `*Category:* ${complaint.category}`,
    `*Customer Name:* ${complaint.fullName}`,
    `*Phone:* ${complaint.phone}`,
    `*Preferred Resolution:* ${complaint.preferredResolution}`,
    `*Details:*`,
    complaint.description,
    `--------------------------------------`,
    `Sending this ticket for fast resolution via customer service team.`,
  ].filter(Boolean).join('\n');
}
