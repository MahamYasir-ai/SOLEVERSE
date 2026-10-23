import React from 'react';
import { X, ArrowRight, ShoppingBag, Heart, PackageSearch, MessageSquare, HelpCircle, Sparkles, Compass } from 'lucide-react';
import { useNavigate } from '../../context/NavigationContext';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES_LIST, PRODUCTS, VIBES_LIST } from '../../data/products';
import { STORE_CONFIG } from '../../data/config';
import { getWhatsAppChatUrl } from '../../lib/whatsapp';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { navigate } = useNavigate();
  const { cartCount, wishlist } = useStore();

  if (!isOpen) return null;

  const handleLink = (path: string) => {
    navigate(path);
    onClose();
  };

  const whatsapp = getWhatsAppChatUrl('Hi SOLEVERSE! I have a question about sneaker drops.');

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-[#17151C] text-[#FAF8F4] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C8FF35] flex items-center justify-center text-[#17151C] font-black text-lg">
              S
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white">
              SOLEVERSE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions Strip */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-stone-800 bg-stone-900/40 text-center">
          <button
            onClick={() => handleLink('/cart')}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 flex flex-col items-center gap-1 text-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#C8FF35]" />
            <span>Bag ({cartCount})</span>
          </button>
          <button
            onClick={() => handleLink('/wishlist')}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 flex flex-col items-center gap-1 text-xs"
          >
            <Heart className="w-4 h-4 text-[#FF4F9A]" />
            <span>Saved ({wishlist.length})</span>
          </button>
          <button
            onClick={() => handleLink('/track-order')}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 flex flex-col items-center gap-1 text-xs"
          >
            <PackageSearch className="w-4 h-4 text-[#FF873D]" />
            <span>Track</span>
          </button>
        </div>

        {/* Nav Sections */}
        <div className="p-5 space-y-6 flex-1">
          {/* Main Routes */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-stone-500 uppercase px-2">
              Explore
            </span>
            <div className="pt-2 space-y-1">
              <button
                onClick={() => handleLink('/shop')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-white font-bold text-base hover:bg-stone-800 transition-colors flex items-center justify-between"
              >
                <span>Shop All Kicks</span>
                <ArrowRight className="w-4 h-4 text-[#C8FF35]" />
              </button>
              <button
                onClick={() => handleLink('/new-arrivals')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-[#C8FF35] font-bold text-base hover:bg-stone-800 transition-colors flex items-center justify-between"
              >
                <span>New Drops 01</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8FF35]/20 text-[#C8FF35]">
                  HOT
                </span>
              </button>
              <button
                onClick={() => handleLink('/best-sellers')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-white font-bold text-base hover:bg-stone-800 transition-colors flex items-center justify-between"
              >
                <span>Best Sellers</span>
                <ArrowRight className="w-4 h-4 text-stone-500" />
              </button>
              <button
                onClick={() => handleLink('/find-your-pair')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-[#FF873D] font-bold text-base hover:bg-stone-800 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4" /> Find Your Pair Quiz
                </span>
                <ArrowRight className="w-4 h-4 text-[#FF873D]" />
              </button>
              <button
                onClick={() => handleLink('/sale')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-[#FF4F9A] font-bold text-base hover:bg-stone-800 transition-colors flex items-center justify-between"
              >
                <span>Sale Up to 30% Off</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4F9A]/20 text-[#FF4F9A]">
                  SALE
                </span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-stone-500 uppercase px-2">
              Categories
            </span>
            <div className="pt-2 grid grid-cols-1 gap-1">
              {CATEGORIES_LIST.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleLink(`/categories/${cat.slug}`)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-stone-900 text-[#C8FF35]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shop by Vibe */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-stone-500 uppercase px-2">
              Shop by Vibe
            </span>
            <div className="pt-2 grid grid-cols-2 gap-2">
              {VIBES_LIST.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => handleLink(`/shop?vibe=${encodeURIComponent(vibe.id)}`)}
                  className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-left hover:border-stone-600 transition-all text-xs"
                >
                  <div className="w-2 h-2 rounded-full mb-1.5" style={{ backgroundColor: vibe.color }} />
                  <span className="font-semibold text-white block line-clamp-1">{vibe.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Service & Utility */}
          <div className="space-y-2 pt-4 border-t border-stone-800">
            <button
              onClick={() => handleLink('/my-orders')}
              className="w-full text-left px-3 py-2 text-xs text-stone-400 hover:text-white flex items-center gap-2"
            >
              <PackageSearch className="w-4 h-4 text-[#C8FF35]" />
              <span>My Demo Orders</span>
            </button>
            <button
              onClick={() => handleLink('/size-guide')}
              className="w-full text-left px-3 py-2 text-xs text-stone-400 hover:text-white flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-stone-400" />
              <span>Shoe Size Conversion Guide</span>
            </button>
            <button
              onClick={() => handleLink('/shipping')}
              className="w-full text-left px-3 py-2 text-xs text-stone-400 hover:text-white flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-stone-400" />
              <span>Pakistan Shipping & Returns</span>
            </button>
            <a
              href={whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Sneaker Rep on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
