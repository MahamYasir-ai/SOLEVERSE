import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from '../context/NavigationContext';
import { formatPKR } from '../lib/currency';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingProgress,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const { navigate } = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, success: res.success });
    if (res.success) setPromoInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 bg-[#0E0D12] text-white">
        <div className="w-20 h-20 rounded-3xl bg-[#17151C] border border-stone-800 flex items-center justify-center mx-auto text-stone-500">
          <ShoppingBag className="w-10 h-10 text-[#C8FF35]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-white">
            YOUR SHOPPING BAG IS EMPTY
          </h1>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            You haven&apos;t added any sneakers to your rotation yet. Explore our latest drop and best-selling silhouettes.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xl shadow-[#C8FF35]/20"
          >
            <span>Explore The Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left bg-[#0E0D12] text-[#FAF8F4]">
      {/* Page Header */}
      <div className="border-b border-stone-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
            Review Your Soles
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
            SHOPPING BAG ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-xs font-mono text-stone-400 hover:text-[#FF4F9A] transition-colors underline"
        >
          Clear bag
        </button>
      </div>

      {/* Free Shipping Progress Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#17151C] text-white mb-8 border border-stone-800">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C8FF35]" />
            {freeShippingProgress.isQualified ? (
              <span className="text-[#C8FF35] font-bold">
                ✓ YOU UNLOCKED FREE EXPRESS SHIPPING ACROSS PAKISTAN!
              </span>
            ) : (
              <span>
                Add <b>{formatPKR(freeShippingProgress.remaining)}</b> more for Free Delivery
              </span>
            )}
          </span>
          <span className="font-bold text-[#C8FF35]">{freeShippingProgress.percentage}%</span>
        </div>
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C8FF35] transition-all duration-300"
            style={{ width: `${freeShippingProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Items List (Dark Card) */}
        <div className="lg:col-span-8 divide-y divide-stone-800 bg-[#17151C] rounded-3xl border border-stone-800 p-6 shadow-xl">
          {cart.map((item) => (
            <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
              {/* Product Thumbnail */}
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-stone-900 border border-stone-800 shrink-0"
                referrerPolicy="no-referrer"
              />

              {/* Product Specs & Stepper */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#C8FF35]">
                        {item.product.brand} · {item.product.sku}
                      </span>
                      <h3
                        onClick={() => navigate(`/products/${item.product.slug}`)}
                        className="font-bold text-base sm:text-lg text-white hover:text-[#C8FF35] transition-colors cursor-pointer font-display"
                      >
                        {item.product.name}
                      </h3>
                      <div className="text-xs font-mono text-stone-400 mt-1 flex gap-3">
                        <span>Size: <b className="text-white">EU {item.selectedSize}</b></span>
                        <span>Color: <b className="text-white">{item.selectedColor}</b></span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-stone-500 hover:text-[#FF4F9A] transition-colors"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-800">
                  {/* Stepper */}
                  <div className="flex items-center border border-stone-700 rounded-xl bg-stone-900 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-stone-400 hover:text-white hover:bg-stone-800 font-mono text-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1.5 font-mono font-bold text-xs text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-stone-400 hover:text-white hover:bg-stone-800 font-mono text-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-stone-500 font-mono block">
                      {formatPKR(item.unitPrice)} each
                    </span>
                    <span className="font-mono font-bold text-base sm:text-lg text-white tabular-nums">
                      {formatPKR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-5">
            <h3 className="font-bold text-base text-white uppercase font-display tracking-wide">
              ORDER SUMMARY
            </h3>

            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#C8FF35]/10 border border-[#C8FF35]/30 text-xs">
                  <div className="flex items-center gap-1.5 text-[#C8FF35] font-mono font-bold">
                    <Tag className="w-4 h-4 text-[#C8FF35]" />
                    <span>{appliedPromo.code} applied (-{formatPKR(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-white underline font-mono text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code (SOLE10)"
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs uppercase font-mono text-white focus:outline-none focus:border-[#C8FF35]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-mono font-bold transition-colors"
                  >
                    APPLY
                  </button>
                </form>
              )}
              {promoMsg && (
                <p className={`text-[11px] mt-1 ${promoMsg.success ? 'text-emerald-400' : 'text-[#FF4F9A]'}`}>
                  {promoMsg.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs font-mono border-t border-stone-800 pt-4">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-white font-bold tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C8FF35]">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span className="tabular-nums">-{formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Shipping (Pakistan)</span>
                <span className="text-white font-bold tabular-nums">
                  {shippingFee === 0 ? 'FREE' : formatPKR(shippingFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-800 flex justify-between text-base font-bold text-white">
                <span>Estimated Total</span>
                <span className="text-xl font-mono text-[#C8FF35] font-black tabular-nums">{formatPKR(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-[#C8FF35]/20"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="w-full text-center text-xs text-stone-400 hover:text-white transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Guarantee Note */}
          <div className="p-4 rounded-2xl bg-[#17151C] border border-stone-800 flex items-center gap-3 text-xs text-stone-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Cash on Delivery available nationwide. Inspect parcel before payment.</span>
          </div>
        </div>

      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowClearConfirm(false)} />
          <div className="relative bg-[#17151C] border border-stone-700 text-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 z-10 shadow-2xl">
            <h4 className="font-bold text-base text-white">Clear Shopping Bag?</h4>
            <p className="text-xs text-stone-400">
              Are you sure you want to remove all sneakers from your current bag?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
