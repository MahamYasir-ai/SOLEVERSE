import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Flame, Shield, ArrowUpRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { useNavigate } from '../context/NavigationContext';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST, PRODUCTS, VIBES_LIST } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { formatPKR } from '../lib/currency';
import { STORE_CONFIG } from '../data/config';
import { getFromStorage, saveToStorage } from '../lib/storage';

export const HomePage: React.FC = () => {
  const { navigate } = useNavigate();
  const { addToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  // New Drop Carousel Scroll Reference
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filter specific product sets
  const flagshipProduct = PRODUCTS[0]; // Valkyrie Chrono-Core 01
  const newDropProducts = PRODUCTS.filter((p) => p.isNew).slice(0, 8);
  const bestSellerProducts = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  const limitedDropProducts = PRODUCTS.filter((p) => p.isLimitedEdition).slice(0, 4);

  // Countdown timer for next limited drop (computed dynamically)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }
    const existing = getFromStorage<string[]>('soleverse_newsletter_subscribers', []);
    saveToStorage('soleverse_newsletter_subscribers', [...existing, newsletterEmail.trim().toLowerCase()]);
    setNewsletterDone(true);
    addToast('Promo code SOLE10 unlocked! Check your bag.', 'success');
  };

  return (
    <div className="bg-[#0E0D12] text-[#FAF8F4] space-y-24 pb-24 overflow-hidden relative">
      
      {/* Dynamic Ambient Club Glow Lights across the entire page */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-[#542C70]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] rounded-full bg-[#C8FF35]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[1800px] left-0 w-[600px] h-[600px] rounded-full bg-[#FF4F9A]/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[2800px] right-10 w-[500px] h-[500px] rounded-full bg-[#FF873D]/12 blur-[130px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Drop Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17151C] border border-[#C8FF35]/30 text-xs font-mono text-[#C8FF35] shadow-lg shadow-[#C8FF35]/5">
                <Sparkles className="w-3.5 h-3.5 text-[#C8FF35] animate-pulse" />
                <span className="tracking-widest uppercase font-bold">
                  DROP 001 / YOUR NEXT OBSESSION
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.05]">
                NOT MADE TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8FF35] via-[#FF873D] to-[#FF4F9A]">
                  BLEND IN.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-stone-300 max-w-xl font-normal leading-relaxed">
                Big energy. Better kicks. Find the pair that speaks your language. Nationwide Cash on Delivery (COD) and fast delivery across Pakistan.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(`/products/${flagshipProduct.slug}`)}
                  className="px-8 py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-sm tracking-wider uppercase transition-transform active:scale-95 shadow-xl shadow-[#C8FF35]/25 flex items-center gap-2 group"
                >
                  <span>SHOP THE DROP</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="px-8 py-4 rounded-2xl bg-[#17151C] hover:bg-stone-900 text-white border border-stone-700 hover:border-[#C8FF35]/50 font-bold text-sm tracking-wider uppercase transition-colors"
                >
                  EXPLORE ALL SNEAKERS
                </button>

                <button
                  onClick={() => navigate('/find-your-pair')}
                  className="px-6 py-4 rounded-2xl bg-[#542C70]/40 hover:bg-[#542C70]/70 text-[#E7D9FF] border border-[#542C70] font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-colors shadow-lg shadow-[#542C70]/20"
                >
                  <Compass className="w-4 h-4 text-[#C8FF35]" />
                  <span>FIND MY PAIR</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 text-xs font-mono">
                <div>
                  <span className="block text-white font-bold text-base font-display">60+ DROPS</span>
                  <span className="text-stone-400">Curated Street Silhouettes</span>
                </div>
                <div>
                  <span className="block text-[#C8FF35] font-bold text-base font-display">100% COD</span>
                  <span className="text-stone-400">Doorstep Verification</span>
                </div>
                <div>
                  <span className="block text-[#FF4F9A] font-bold text-base font-display">7-DAY</span>
                  <span className="text-stone-400">Hassle-Free Exchange</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card (Matches User Reference Image) */}
            <div className="lg:col-span-5 relative">
              <div
                onClick={() => navigate(`/products/${flagshipProduct.slug}`)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden bg-gradient-to-b from-[#1E1B26] to-[#121016] border border-[#C8FF35]/30 shadow-2xl p-4 transition-transform hover:-translate-y-2 duration-300"
              >
                {/* Neon Frame Glow Accent */}
                <div className="absolute inset-0 border-2 border-[#C8FF35]/30 rounded-3xl pointer-events-none group-hover:border-[#C8FF35]/80 transition-colors shadow-inner" />

                {/* Flagship Image Asset */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={flagshipProduct.images[0]}
                    alt={flagshipProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#17151C]/90 backdrop-blur-md text-[#C8FF35] font-mono text-[11px] font-bold border border-[#C8FF35]/40 shadow-lg">
                      FLAGSHIP RELEASE
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#17151C]/95 backdrop-blur-md text-white font-mono text-xs font-black border border-stone-700 shadow-xl">
                      {formatPKR(flagshipProduct.price)}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 pb-2 px-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#C8FF35] transition-colors font-display">
                      {flagshipProduct.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Segmented Kinetic Sole · Multiverse Neon
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#17151C] border border-stone-700 group-hover:bg-[#C8FF35] group-hover:text-[#17151C] text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY EXPLORER (DARK GEN Z CLUB CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
              EXPLORE BY SILHOUETTE
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-mono font-bold text-[#C8FF35] hover:underline flex items-center gap-1.5 group"
          >
            <span>VIEW ALL SILHOUETTES</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Category Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES_LIST.map((cat, idx) => {
            const representativeProduct = PRODUCTS.find((p) => p.category === cat.slug);
            const imageSrc = representativeProduct?.images[0] || flagshipProduct.images[0];
            const actualCount = PRODUCTS.filter((p) => p.category === cat.slug).length;

            return (
              <div
                key={cat.slug}
                onClick={() => navigate(`/categories/${cat.slug}`)}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#17151C] border border-stone-800/90 hover:border-[#C8FF35]/70 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-[#C8FF35]/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Background Sneaker Image */}
                <img
                  src={imageSrc}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 group-hover:opacity-85 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Contrast Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D12] via-black/40 to-transparent" />

                {/* Category Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#C8FF35] font-bold">
                    0{idx + 1} / {actualCount} MODELS IN STOCK
                  </span>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white group-hover:text-[#C8FF35] transition-colors leading-tight mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. NEW DROP SECTION (DARK CLUB CAROUSEL) */}
      <section className="bg-[#121017] py-16 border-y border-stone-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#FF873D]">
                <Flame className="w-4 h-4 fill-[#FF873D]" /> Fresh From The Lab
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
                DROP 001 ARRIVALS
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
                disabled={carouselIndex === 0}
                className="p-3 rounded-xl bg-[#17151C] border border-stone-800 text-stone-300 hover:text-white hover:border-[#C8FF35]/50 disabled:opacity-40 transition-colors"
                aria-label="Previous drops"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIndex((prev) => Math.min(newDropProducts.length - 4, prev + 1))}
                disabled={carouselIndex >= newDropProducts.length - 4}
                className="p-3 rounded-xl bg-[#17151C] border border-stone-800 text-stone-300 hover:text-white hover:border-[#C8FF35]/50 disabled:opacity-40 transition-colors"
                aria-label="Next drops"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Carousel Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newDropProducts.slice(carouselIndex, carouselIndex + 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/new-arrivals')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#17151C] hover:bg-stone-800 text-[#C8FF35] border border-stone-700 hover:border-[#C8FF35]/50 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
            >
              <span>Explore All New Drops</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY VIBE (DARK CLUB FREQUENCY CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
            Dress For The Frequency
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
            SHOP BY VIBE
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Match your footwear to your mood. Four curated style rotations crafted for modern Gen Z street presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIBES_LIST.map((vibe) => (
            <div
              key={vibe.id}
              onClick={() => navigate(`/shop?vibe=${encodeURIComponent(vibe.id)}`)}
              className="group p-6 rounded-3xl bg-[#17151C] border border-stone-800/90 hover:border-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between text-left"
            >
              <div>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 shadow-md"
                  style={{ backgroundColor: vibe.color, color: '#17151C' }}
                >
                  ✦
                </div>
                <h3 className="font-display font-black text-xl text-white group-hover:text-[#C8FF35] transition-colors leading-tight">
                  {vibe.label}
                </h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  {vibe.subtitle}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between text-xs font-mono font-bold text-[#C8FF35]">
                <span>EXPLORE VIBE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN BANNER (HIGH ENERGY POSTER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#17151C] via-[#211D2B] to-[#17151C] text-white p-8 sm:p-14 border border-stone-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8FF35] font-bold">
                Editorial Campaign 01
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
                YOUR FIT ISN&apos;T COMPLETE WITHOUT THE KICKS.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed">
                Whether pairing baggy denim with brutalist chunky platforms or elevating clean monochrome basics with vintage track runners, your shoes define the silhouette.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-8 py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-xl shadow-[#C8FF35]/20"
                >
                  BUILD YOUR ROTATION
                </button>
                <button
                  onClick={() => navigate('/find-your-pair')}
                  className="px-6 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-xs uppercase tracking-wider"
                >
                  Take Sizing Quiz
                </button>
              </div>
            </div>

            {/* Campaign Visual Tile */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-stone-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80"
                  alt="Streetwear Sneaker Editorial"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. LIMITED-EDITION DROPS & LIVE COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF4F9A] font-bold uppercase tracking-wider">
              <span>⚡</span> Numbered Vault Releases
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
              LIMITED EDITION DROPS
            </h2>
          </div>

          {/* Live Dynamic Countdown */}
          <div className="flex items-center gap-2 p-3 bg-[#17151C] text-white rounded-2xl border border-stone-800 font-mono text-xs shadow-xl">
            <span className="text-[#C8FF35] font-bold">DROP CLOSES IN:</span>
            <div className="flex items-center gap-1 font-bold text-sm">
              <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[#FF4F9A]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {limitedDropProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. BEST SELLERS GRID (DARK CLUB SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8FF35]">
              Community Favorites
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
              BEST SELLERS IN PAKISTAN
            </h2>
          </div>
          <button
            onClick={() => navigate('/best-sellers')}
            className="text-xs font-mono font-bold text-stone-300 hover:text-[#C8FF35] flex items-center gap-1.5"
          >
            <span>VIEW ALL BEST SELLERS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS (DARK GLOWING STREET CARDS) */}
      <section className="bg-[#121017] py-16 border-y border-stone-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
              Verified Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
              WHAT THE STREET IS SAYING
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              *Sample reviews based on prototype customer tests in Karachi, Lahore, and Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Zain K.',
                city: 'Lahore (DHA Phase 5)',
                rating: 5,
                shoe: 'Valkyrie Chrono-Core 01',
                text: 'The lime and hot pink layered aesthetic matches the product images 100%. Got so many stares at the sneaker event. Cushioning is surprisingly plush.',
              },
              {
                name: 'Mahnoor A.',
                city: 'Karachi (Clifton)',
                rating: 5,
                shoe: 'Mono Court Clean White',
                text: 'Finding genuine buttery calfskin sneakers locally in Pakistan with proper COD has always been painful. SOLEVERSE delivered in 2 days. Perfect clean fit.',
              },
              {
                name: 'Usman S.',
                city: 'Islamabad (F-7)',
                rating: 5,
                shoe: 'Titan Strata Chunky Runner',
                text: 'Heavyweight dad-shoe silhouette without being clunky. Trax delivered on time and the WhatsApp team answered my sizing question in 5 minutes.',
              },
            ].map((review, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#17151C] border border-stone-800/90 hover:border-[#C8FF35]/40 shadow-xl flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#FF873D] text-sm mb-3">
                    {'★'.repeat(review.rating)}
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed italic">
                    &quot;{review.text}&quot;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <span className="text-stone-400">{review.city}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#C8FF35] font-semibold">
                    {review.shoe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. VIP DROP LIST NEWSLETTER (CLUB PASS DESIGN) */}
      <section className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1C1A25] to-[#121017] text-white border border-[#C8FF35]/30 shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C8FF35] font-bold">
            Private Drop Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-2">
            GET 10% OFF YOUR FIRST ORDER
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-md mx-auto">
            Subscribe for instant VIP access to upcoming 2026 sneaker releases, secret flash sales, and restock alerts.
          </p>

          {newsletterDone ? (
            <div className="mt-6 p-4 rounded-2xl bg-[#C8FF35]/10 border border-[#C8FF35]/40 text-[#C8FF35] font-mono text-xs max-w-md mx-auto">
              ✓ Subscribed! Use promo code <b>SOLE10</b> at checkout for 10% off.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-[#17151C] border border-stone-700 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-lg shadow-[#C8FF35]/20"
              >
                Claim 10% Off
              </button>
            </form>
          )}

          <p className="text-[10px] text-stone-500 mt-3">
            *Demo data saved locally in your browser. No spam, ever.
          </p>
        </div>
      </section>

    </div>
  );
};
