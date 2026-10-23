import React, { useState, useEffect } from 'react';
import { PackageSearch, Search, Truck, MapPin, AlertCircle, ArrowRight, CheckCircle2, MessageSquare, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from '../context/NavigationContext';
import { Order } from '../types';
import { formatPKR } from '../lib/currency';
import { formatOrderInquiry, getWhatsAppChatUrl } from '../lib/whatsapp';

export const TrackOrderPage: React.FC = () => {
  const { orders, findOrderByPhoneOrEmail, getOrderById, addToast } = useStore();
  const { queryParams, navigate } = useNavigate();

  const [orderIdInput, setOrderIdInput] = useState(queryParams.get('id') || '');
  const [phoneOrEmailInput, setPhoneOrEmailInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-search if ID parameter is provided in URL
  useEffect(() => {
    const paramId = queryParams.get('id');
    if (paramId) {
      setOrderIdInput(paramId);
      const matched = getOrderById(paramId);
      if (matched) {
        setFoundOrder(matched);
        setHasSearched(true);
      }
    }
  }, [queryParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setHasSearched(true);

    if (!orderIdInput.trim()) {
      setErrorMessage('Please enter your Order ID or Trax tracking consignment number.');
      setFoundOrder(null);
      return;
    }

    let matched = getOrderById(orderIdInput.trim());

    if (!matched && phoneOrEmailInput.trim()) {
      matched = findOrderByPhoneOrEmail(orderIdInput.trim(), phoneOrEmailInput.trim()) || undefined;
    }

    if (matched) {
      setFoundOrder(matched);
      setErrorMessage('');
    } else {
      setFoundOrder(null);
      setErrorMessage(`No demo order found matching "${orderIdInput.trim()}". Check your spelling or try sample demo orders below.`);
    }
  };

  const handleQuickFill = (sampleId: string, sampleContact: string) => {
    setOrderIdInput(sampleId);
    setPhoneOrEmailInput(sampleContact);
    const matched = getOrderById(sampleId);
    if (matched) {
      setFoundOrder(matched);
      setHasSearched(true);
      setErrorMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-10 bg-[#0E0D12] text-[#FAF8F4]">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF873D]">
          Nationwide Logistics Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
          TRACK YOUR SNEAKERS
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Enter your 6-digit Order ID (e.g. <b>SV-PK-782914</b>) and your contact details to check live consignment progress.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
              Order ID / Tracking # *
            </label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="e.g. SV-PK-782914 or TRX-849201"
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-xs uppercase font-mono text-white focus:outline-none focus:border-[#C8FF35]"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
              Phone / Email (Verification)
            </label>
            <input
              type="text"
              value={phoneOrEmailInput}
              onChange={(e) => setPhoneOrEmailInput(e.target.value)}
              placeholder="0300 1234567 or email"
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C8FF35]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#C8FF35]/20"
            >
              <Search className="w-4 h-4" />
              <span>TRACK ORDER</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Order Fill Buttons for Testing */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400">
          <span>Test Demo Presets:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              onClick={() => handleQuickFill(o.id, o.customer.phone)}
              className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 hover:border-[#C8FF35] text-stone-300 transition-colors"
            >
              {o.id} ({o.status})
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Found Order Detailed View */}
      {foundOrder && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Order Header Badge */}
          <div className="p-6 rounded-3xl bg-[#17151C] text-white border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black font-display text-white">
                  {foundOrder.id}
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#C8FF35] text-[#17151C] font-bold uppercase">
                  {foundOrder.status}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1 font-mono">
                Booked via <b>{foundOrder.courierName}</b> · Tracking: <b>{foundOrder.trackingNumber}</b>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-stone-400 block">Estimated Arrival:</span>
              <span className="text-sm font-bold text-[#C8FF35]">{foundOrder.estimatedDeliveryDate}</span>
            </div>
          </div>

          {/* Fulfillment Milestones Timeline */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-6">
            <h3 className="font-bold text-sm uppercase font-display tracking-wider text-[#C8FF35]">
              DISPATCH & DELIVERY TIMELINE
            </h3>

            <div className="relative border-l-2 border-stone-800 ml-4 pl-6 space-y-6">
              {foundOrder.milestones.map((m, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                      m.completed ? 'border-[#C8FF35] bg-[#C8FF35]' : 'border-stone-700 bg-stone-900'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-white">{m.label}</h4>
                      <span className="text-[10px] font-mono text-stone-500">{m.date}</span>
                      {m.current && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#C8FF35]/20 text-[#C8FF35] font-bold border border-[#C8FF35]/30">
                          ACTIVE MILESTONE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Content & Delivery Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box Contents */}
            <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3">
              <h4 className="font-bold text-xs font-mono uppercase text-[#C8FF35] tracking-wider">
                Sneakers In Box ({foundOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-800">
                {foundOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="font-bold text-white">{item.product.name}</h5>
                        <p className="text-[11px] font-mono text-stone-400">
                          EU {item.selectedSize} · {item.selectedColor}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatPKR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-between text-xs font-mono font-bold">
                <span className="text-stone-400">Total Amount:</span>
                <span className="text-sm text-[#C8FF35]">{formatPKR(foundOrder.pricing.total)}</span>
              </div>
            </div>

            {/* Address & WhatsApp Support */}
            <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 space-y-4 text-xs font-mono">
              <h4 className="font-bold text-xs uppercase text-[#C8FF35] tracking-wider">
                Destination & Payment
              </h4>
              <div className="text-stone-400 space-y-1">
                <p><b className="text-white">Recipient:</b> {foundOrder.customer.fullName}</p>
                <p><b className="text-white">Phone:</b> {foundOrder.customer.phone}</p>
                <p><b className="text-white">Address:</b> {foundOrder.customer.address}, {foundOrder.customer.area}, {foundOrder.customer.city}</p>
                <p><b className="text-white">Payment:</b> {foundOrder.paymentMethod.name}</p>
              </div>

              <div className="pt-2">
                <a
                  href={getWhatsAppChatUrl(formatOrderInquiry(foundOrder.id, foundOrder.customer.fullName)).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Ask Courier Questions on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
