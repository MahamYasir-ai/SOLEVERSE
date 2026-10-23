import React, { useState } from 'react';
import { useNavigate } from '../../context/NavigationContext';
import { useStore } from '../../context/StoreContext';
import { STORE_CONFIG } from '../../data/config';
import { getWhatsAppChatUrl } from '../../lib/whatsapp';
import { CATEGORIES_LIST } from '../../data/products';
import { ArrowRight, Check, MessageSquare, ShieldCheck, Truck, RefreshCw, Send } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../lib/storage';

export const Footer: React.FC = () => {
  const { navigate } = useNavigate();
  const { addToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }
    const existing = getFromStorage<string[]>('soleverse_newsletter_subscribers', []);
    if (!existing.includes(email.trim().toLowerCase())) {
      saveToStorage('soleverse_newsletter_subscribers', [...existing, email.trim().toLowerCase()]);
    }
    setIsSubscribed(true);
    addToast('Welcome to the SOLEVERSE drop list! (Saved locally in demo)', 'success');
    setEmail('');
  };

  const whatsapp = getWhatsAppChatUrl('Hi SOLEVERSE! I have a general customer inquiry.');

  return (
    <footer className="bg-[#17151C] text-[#FAF8F4] border-t border-stone-800">
      {/* Trust Badges Strip */}
      <div className="border-b border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#C8FF35]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Free Express Shipping</h4>
              <p className="text-xs text-stone-400">On all orders over PKR 15,000 nationwide.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#FF4F9A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Cash on Delivery (COD)</h4>
              <p className="text-xs text-stone-400">Pay cash upon doorstep verification.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#FF873D]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">7-Day Free Exchange</h4>
              <p className="text-xs text-stone-400">Easy size swap if your fit isn't 100%.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Direct WhatsApp Concierge</h4>
              <p className="text-xs text-stone-400">Real sneakerhead advice in minutes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C8FF35] flex items-center justify-center text-[#17151C] font-black text-xl">
                S
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                SOLEVERSE
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Your world. Your soles. Pakistan&apos;s next-generation sneaker collective curating high-voltage futuristic silhouettes, chunky runners, and iconic street heat.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="block text-xs font-mono tracking-wider text-[#C8FF35] uppercase mb-2">
                Join Drop List & Get 10% Off
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>You&apos;re subscribed! Promo code <b>SOLE10</b> is active for your cart.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for private drops..."
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>JOIN</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
              <p className="text-[11px] text-stone-500 mt-1.5">
                *Demo note: Subscriptions are stored locally in your browser session.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#FAF8F4] font-bold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {CATEGORIES_LIST.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate(`/categories/${cat.slug}`)}
                    className="hover:text-[#C8FF35] transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/shop')}
                  className="text-[#FF4F9A] hover:underline font-semibold"
                >
                  View All 60+ Drops →
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#FAF8F4] font-bold mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/track-order')} className="hover:text-[#C8FF35] transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/my-orders')} className="hover:text-[#C8FF35] transition-colors">
                  My Orders History
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/size-guide')} className="hover:text-[#C8FF35] transition-colors">
                  Size Guide & Fit Tips
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shipping')} className="hover:text-[#C8FF35] transition-colors">
                  Shipping Rates & COD
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/returns')} className="hover:text-[#C8FF35] transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-[#C8FF35] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <a
                  href={whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  <span>WhatsApp Support</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* About & Policies */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#FAF8F4] font-bold mb-4">
              SOLEVERSE
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-[#C8FF35] transition-colors">
                  About Our Collective
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-[#C8FF35] transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-[#C8FF35] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-[#C8FF35] transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-2 text-xs text-stone-500">
                <span>Karachi HQ: {STORE_CONFIG.hqAddress}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Demo Payment Indicators */}
        <div className="pt-12 mt-12 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-stone-400">Demo Checkout Options:</span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 font-medium">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 font-medium">
              JazzCash Demo
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 font-medium">
              EasyPaisa Demo
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 font-medium">
              Raast / Bank Direct Demo
            </span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p>© 2026 SOLEVERSE Collective. All rights reserved.</p>
            <p className="text-[11px] text-stone-600">
              Demonstration ecommerce application. No live banking cards or payment APIs are charged.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
