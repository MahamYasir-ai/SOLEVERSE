import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from '../../context/NavigationContext';
import { formatPKR } from '../../lib/currency';

export const MiniCartDrawer: React.FC = () => {
  const {
    cart,
    isMiniCartOpen,
    setIsMiniCartOpen,
    updateCartQuantity,
    removeFromCart,
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
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isMiniCartOpen) return null;

  const handleCheckout = () => {
    setIsMiniCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsMiniCartOpen(false);
    navigate('/cart');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, success: res.success });
    if (res.success) setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMiniCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#17151C] text-[#FAF8F4] h-full shadow-2xl flex flex-col z-10 border-l border-stone-800">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C8FF35]" />
            <h3 className="font-display font-black text-lg text-white">
              YOUR BAG ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsMiniCartOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-stone-900 border-b border-stone-800 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Truck className="w-3.5 h-3.5 text-[#C8FF35]" />
              {freeShippingProgress.isQualified
                ? 'FREE EXPRESS SHIPPING UNLOCKED!'
                : `Add ${formatPKR(freeShippingProgress.remaining)} more for Free Shipping`}
            </span>
            <span className="text-[#C8FF35] font-bold">
              {freeShippingProgress.percentage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C8FF35] rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-800/80">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Your Bag is Empty</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Your rotation needs fresh heat. Browse our new drops and limited edition sneakers.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsMiniCartOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#C8FF35] text-[#17151C] font-bold text-xs uppercase tracking-wider hover:bg-[#bbf325] transition-colors"
              >
                Shop Drop 01
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-stone-900 shrink-0 border border-stone-800"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                        <span>EU {item.selectedSize}</span> · <span>{item.selectedColor}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-500 hover:text-[#FF4F9A] p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-700 rounded-lg overflow-hidden bg-stone-900">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-1 text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-mono font-bold text-sm text-[#C8FF35] tabular-nums">
                      {formatPKR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-800 bg-stone-900/60 space-y-4">
            {/* Promo Code Form */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#C8FF35]/10 border border-[#C8FF35]/30 text-xs">
                  <div className="flex items-center gap-1.5 text-[#C8FF35] font-mono font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedPromo.code} applied (-{formatPKR(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-white text-xs underline"
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
                    placeholder="Promo code (e.g. SOLE10)"
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs uppercase font-mono text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    APPLY
                  </button>
                </form>
              )}
              {promoMessage && (
                <p className={`text-[11px] mt-1 ${promoMessage.success ? 'text-emerald-400' : 'text-[#FF4F9A]'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-white tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C8FF35]">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Shipping (Pakistan)</span>
                <span className="text-white tabular-nums">
                  {shippingFee === 0 ? 'FREE' : formatPKR(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold">
                <span className="text-white">Estimated Total</span>
                <span className="text-[#C8FF35] text-base tabular-nums">{formatPKR(total)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleViewCart}
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors"
              >
                View Full Bag
              </button>
              <button
                onClick={handleCheckout}
                className="py-3 px-4 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-lg shadow-[#C8FF35]/15"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
