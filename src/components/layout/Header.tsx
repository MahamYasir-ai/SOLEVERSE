import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from '../../context/NavigationContext';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES_LIST } from '../../data/products';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileNav }) => {
  const { navigate, currentPath } = useNavigate();
  const { cartCount, wishlist, setIsMiniCartOpen } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', path: '/shop' },
    { label: 'New Drops', path: '/new-arrivals' },
    { label: 'Best Sellers', path: '/best-sellers' },
    { label: 'Find Your Pair', path: '/find-your-pair' },
    { label: 'Sale', path: '/sale' },
  ];

  return (
    <header
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#17151C]/95 backdrop-blur-md border-b border-stone-800 shadow-xl'
          : 'bg-[#17151C] border-b border-stone-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-left group flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#C8FF35]"
              aria-label="SOLEVERSE Home"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C8FF35] flex items-center justify-center text-[#17151C] font-black text-xl tracking-tighter group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#FAF8F4] group-hover:text-[#C8FF35] transition-colors font-display">
                  SOLEVERSE
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono tracking-widest text-[#FF4F9A] uppercase">
                  PK
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`relative py-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#C8FF35]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8FF35] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Quick Categories Mega Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                onClick={() => navigate('/shop')}
                className="py-2 text-stone-300 hover:text-[#C8FF35] flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                Categories
                <span className="text-[10px] font-mono text-stone-500">▼</span>
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-[#17151C] border border-stone-700/80 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        navigate(`/categories/${cat.slug}`);
                        setIsMegaMenuOpen(false);
                      }}
                      className="p-3 text-left rounded-xl hover:bg-stone-900 border border-transparent hover:border-[#C8FF35]/30 transition-all group"
                    >
                      <div className="flex items-center justify-between text-[#FAF8F4] group-hover:text-[#C8FF35] font-bold text-sm">
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                        {cat.description}
                      </p>
                    </button>
                  ))}
                  <div className="col-span-2 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono text-[#C8FF35] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> 70 Authentic Street Silhouettes in Stock
                    </span>
                    <button
                      onClick={() => {
                        navigate('/shop');
                        setIsMegaMenuOpen(false);
                      }}
                      className="text-[#FF4F9A] hover:underline font-semibold"
                    >
                      View All Kicks →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Wishlist, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors focus-visible:outline-2 focus-visible:outline-[#C8FF35]"
              aria-label="Search shoes and collections"
              title="Search (Press / to search)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors focus-visible:outline-2 focus-visible:outline-[#C8FF35]"
              aria-label={`Wishlist (${wishlist.length} saved)`}
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#FF4F9A] fill-[#FF4F9A]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF4F9A] text-white text-[10px] font-mono font-bold flex items-center justify-center ring-2 ring-[#17151C]">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsMiniCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-sm transition-transform active:scale-95 shadow-md shadow-[#C8FF35]/15 focus-visible:outline-2 focus-visible:outline-white"
              aria-label={`Shopping Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono text-xs font-black">{cartCount}</span>
              <span className="hidden md:inline text-xs font-semibold">BAG</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
