import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageSquare, PackageSearch, ArrowRight, Truck, MapPin, Calendar, Clock, Copy, Check } from 'lucide-react';
import { useNavigate } from '../context/NavigationContext';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../lib/currency';
import { formatWhatsAppCheckoutOrder, getWhatsAppChatUrl } from '../lib/whatsapp';

interface OrderConfirmationPageProps {
  orderId: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const { getOrderById, addToast } = useStore();
  const { navigate } = useNavigate();
  const [copied, setCopied] = useState(false);

  const order = getOrderById(orderId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">
          We could not locate order &quot;{orderId}&quot; in your browser&apos;s demo session.
        </p>
        <button
          onClick={() => navigate('/my-orders')}
          className="px-6 py-2.5 rounded-xl bg-stone-900 text-[#C8FF35] font-bold text-xs"
        >
          View My Demo Orders
        </button>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    addToast('Order ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = formatWhatsAppCheckoutOrder(order);
  const whatsappUrl = getWhatsAppChatUrl(whatsappMessage).url;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-10">
      
      {/* Success Hero Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#17151C] text-white border border-stone-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C8FF35]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8FF35]/20 text-[#C8FF35] text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>DEMO ORDER PLACED SUCCESSFULLY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            THANK YOU, {order.customer.fullName.toUpperCase()}!
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
            Your sneaker rotation is being prepared for dispatch at our Karachi hub. A demo confirmation SMS has been logged for your phone (<b>{order.customer.phone}</b>).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
              <span className="text-stone-400">Order ID:</span>
              <span className="text-[#C8FF35] font-bold">{order.id}</span>
              <button
                onClick={handleCopyOrderId}
                className="p-1 hover:text-white transition-colors"
                title="Copy order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
              <span className="text-stone-400">Consignment:</span>
              <span className="text-white font-bold">{order.trackingNumber}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
              <span className="text-stone-400">Courier:</span>
              <span className="text-white font-bold">{order.courierName}</span>
            </div>
          </div>

          {/* WhatsApp Direct Confirmation Button */}
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Order Summary via WhatsApp</span>
            </a>

            <button
              onClick={() => navigate(`/track-order?id=${order.id}`)}
              className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <PackageSearch className="w-4 h-4 text-[#C8FF35]" />
              <span>Track Live Delivery Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Milestone Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-stone-900 uppercase font-display tracking-wider">
          LIVE DEMO FULFILLMENT TIMELINE
        </h3>

        <div className="relative border-l-2 border-stone-200 ml-4 pl-6 space-y-6">
          {order.milestones.map((m, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                  m.completed
                    ? 'border-[#17151C] bg-[#C8FF35]'
                    : 'border-stone-300 bg-white'
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-stone-900">{m.label}</h4>
                  <span className="text-[10px] font-mono text-stone-400">{m.date}</span>
                  {m.current && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      CURRENT
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items & Customer Receipt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Items */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-900">
            ITEMS PURCHASED ({order.items.length})
          </h3>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900">{item.product.name}</h4>
                    <p className="text-stone-500 text-[11px] font-mono">
                      EU {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-stone-900 tabular-nums">
                  {formatPKR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Math */}
          <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span className="text-stone-900 tabular-nums">{formatPKR(order.pricing.subtotal)}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.pricing.discountCode || 'Promo'})</span>
                <span className="tabular-nums">-{formatPKR(order.pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-500">
              <span>Delivery</span>
              <span className="text-stone-900 tabular-nums">
                {order.pricing.shipping === 0 ? 'FREE' : formatPKR(order.pricing.shipping)}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Paid / Due</span>
              <span className="text-base font-mono font-black tabular-nums">
                {formatPKR(order.pricing.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="md:col-span-5 bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4 text-xs font-mono">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
            DELIVERY DETAILS
          </h3>

          <div className="space-y-2 text-stone-600">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Recipient:</span>
              <p className="font-bold text-stone-900">{order.customer.fullName}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.email}</p>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Destination:</span>
              <p className="font-bold text-stone-900">{order.customer.address}</p>
              <p>{order.customer.area}, {order.customer.city}, Pakistan {order.customer.postalCode}</p>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Payment:</span>
              <p className="font-bold text-stone-900">{order.paymentMethod.name}</p>
            </div>

            {order.customer.deliveryInstructions && (
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Instructions:</span>
                <p className="italic text-stone-700">&quot;{order.customer.deliveryInstructions}&quot;</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200">
            <button
              onClick={() => navigate('/shop')}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Continue Shopping →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
