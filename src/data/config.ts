import { DeliveryMethod, DiscountCode, PaymentMethod } from '../types';

export const STORE_CONFIG = {
  name: 'SOLEVERSE',
  tagline: 'Your world. Your soles.',
  supportWhatsAppNumber: '923001234567', // Standard format: international code without '+' (Pakistan +92)
  supportEmail: 'crew@soleverse.pk',
  supportHours: 'Mon – Sat: 11:00 AM – 9:00 PM PKT',
  hqAddress: 'Block 4, Clifton, Karachi, Pakistan',
  freeShippingThreshold: 15000, // PKR
  standardShippingRate: 450, // PKR
  expressShippingRate: 850, // PKR
  currency: 'PKR',
};

export const PROMO_CODES: Record<string, DiscountCode> = {
  SOLE10: {
    code: 'SOLE10',
    type: 'percentage',
    value: 10,
    minOrder: 5000,
    description: '10% off on all sneakers for orders over PKR 5,000',
  },
  FIRST500: {
    code: 'FIRST500',
    type: 'fixed',
    value: 500,
    minOrder: 3000,
    description: 'PKR 500 flat off your first order (min PKR 3,000)',
  },
  DROP20: {
    code: 'DROP20',
    type: 'percentage',
    value: 20,
    minOrder: 25000,
    description: '20% off on premium rotations over PKR 25,000',
  },
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Standard Trax/TCS Courier',
    estimatedDays: '3–4 Business Days across Pakistan',
    price: STORE_CONFIG.standardShippingRate,
  },
  {
    id: 'express',
    name: 'Express Air Courier (Karachi / Lahore / Islamabad)',
    estimatedDays: '1–2 Business Days Priority Dispatch',
    price: STORE_CONFIG.expressShippingRate,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    badge: 'Most Popular in Pakistan',
    description: 'Pay cash to the courier agent when your box arrives at your doorstep.',
  },
  {
    id: 'jazzcash_demo',
    name: 'JazzCash Demo Wallet / QR',
    badge: 'Instant Verification (Demo)',
    description: 'Simulated payment via JazzCash 0300-XXXXXXX sandbox. No actual deduction.',
  },
  {
    id: 'easypaisa_demo',
    name: 'EasyPaisa Demo Mobile Account',
    badge: 'Mobile Banking (Demo)',
    description: 'Simulated payment via EasyPaisa 0345-XXXXXXX sandbox. No actual deduction.',
  },
  {
    id: 'bank_transfer_demo',
    name: 'Raast / Bank Direct Demo',
    badge: '0% Surcharge (Demo)',
    description: 'Meezan / HBL / Standard Chartered demo IBAN generation for receipt upload simulation.',
  },
];

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Wah Cantt',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Jhelum',
  'Mirpur (AJK)',
];

export const SNEAKER_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];
