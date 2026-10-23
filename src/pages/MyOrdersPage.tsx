import React from 'react';
import { Package, Truck, ArrowRight, ShoppingBag, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from '../context/NavigationContext';
import { formatPKR } from '../lib/currency';
import { formatOrderInquiry, getWhatsAppChatUrl } from '../lib/whatsapp';

export const MyOrdersPage: React.FC = () => {
  const { orders } = useStore();
  const { navigate } = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-left space-y-8">
      {/* Header */}
      <div className="border-b border-stone-800 pb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
          Session Orders · Vault
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
          MY DEMO ORDERS ({orders.length})
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          These demo orders are saved locally in this browser. You can track real simulated milestone timelines anytime.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-[#17151C] rounded-3xl border border-stone-800 p-8 space-y-4">
          <Package className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-xl font-bold font-display text-white">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Ready to cop your next pair? Discover the 2026 drop catalog with easy Cash on Delivery.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2.5 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C8FF35]/15"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const wa = getWhatsAppChatUrl(formatOrderInquiry(order.id, order.customer.fullName));

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-4 hover:border-[#C8FF35]/40 transition-colors"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{order.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-[#C8FF35] border border-stone-700 font-bold uppercase text-[10px]">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-stone-400 flex items-center gap-2">
                    <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="text-white font-bold">{order.paymentMethod.name}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-stone-800/60">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-900 shrink-0 border border-stone-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4
                            onClick={() => navigate(`/products/${item.product.slug}`)}
                            className="font-bold text-white hover:text-[#C8FF35] cursor-pointer transition-colors"
                          >
                            {item.product.name}
                          </h4>
                          <span className="text-stone-400 text-[11px] font-mono">
                            EU {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#FAF8F4]">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Strip */}
                <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="font-mono">
                    <span className="text-stone-400">Destination: </span>
                    <span className="text-stone-200 font-medium">
                      {order.customer.area}, {order.customer.city}
                    </span>
                    <span className="text-stone-500"> ({order.courierName})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#FAF8F4]">
                      Total: {formatPKR(order.pricing.total)}
                    </span>

                    <button
                      onClick={() => navigate(`/track-order?id=${order.id}`)}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-[#C8FF35] font-bold text-xs uppercase font-mono transition-colors"
                    >
                      Track Parcel →
                    </button>

                    <a
                      href={wa.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-stone-900 hover:bg-emerald-950/40 border border-stone-800 text-emerald-400 transition-colors"
                      title="WhatsApp Support"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
