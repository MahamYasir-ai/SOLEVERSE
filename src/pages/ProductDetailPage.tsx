import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, MessageSquare, ArrowLeft, Check, ChevronDown, ChevronUp, Ruler, Share2, Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatPKR } from '../lib/currency';
import { useNavigate } from '../context/NavigationContext';
import { useStore } from '../context/StoreContext';
import { SizeGuideModal } from '../components/ui/SizeGuideModal';
import { formatProductInquiry, getWhatsAppChatUrl } from '../lib/whatsapp';
import { ProductCard } from '../components/products/ProductCard';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { navigate } = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed, recentlyViewedProducts, addToast } = useStore();

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product.availableSizes[0] || 42
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
    }
  }, [product.id]);

  const isSaved = isInWishlist(product.id);
  const currentStockForSize = selectedSize ? product.stockPerSize[selectedSize] ?? 5 : 0;
  const isOutOfStock = currentStockForSize <= 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select your shoe size before adding to bag.', 'warning');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      addToast('Please select your shoe size first.', 'warning');
      return;
    }
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const whatsappInquiry = getWhatsAppChatUrl(
    formatProductInquiry(product, selectedSize || undefined, selectedColor)
  );

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.vibe === product.vibe)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-16 bg-[#0E0D12] text-[#FAF8F4]">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
        <button
          onClick={() => navigate('/shop')}
          className="hover:text-[#C8FF35] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Shop</span>
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/categories/${product.category}`)}
          className="hover:text-[#C8FF35] transition-colors"
        >
          {product.categoryLabel}
        </button>
        <span>/</span>
        <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main PDP Grid: Gallery (Left) + Purchase Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Imagery Gallery (Dark Stage) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Visual Stage */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1E1B26] to-[#121016] border border-stone-800 shadow-2xl flex items-center justify-center">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={`${product.name} angle ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-center transition-all duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Tag Overlay */}
            {product.isLimitedEdition && (
              <span className="absolute top-4 left-4 text-xs font-mono tracking-wider uppercase font-bold text-white bg-[#542C70] border border-[#FF4F9A]/30 px-3 py-1 rounded-lg">
                Numbered Vault Drop
              </span>
            )}
            {product.isNew && !product.isLimitedEdition && (
              <span className="absolute top-4 left-4 text-xs font-mono tracking-wider uppercase font-bold text-[#17151C] bg-[#C8FF35] px-3 py-1 rounded-lg">
                Drop 01 Release
              </span>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-[#17151C]/90 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] shadow-md transition-transform active:scale-90"
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'text-[#FF4F9A] fill-[#FF4F9A]' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#C8FF35] ring-2 ring-[#C8FF35]/30'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module (Dark Club Card) */}
        <div className="lg:col-span-5 space-y-6 bg-[#17151C] p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl">
          <div>
            {/* Brand / Collection */}
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 uppercase tracking-widest mb-1.5">
              <span className="text-[#C8FF35]">{product.brand} · {product.collection}</span>
              <span className="text-stone-500">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-2 text-xs font-mono">
              <div className="flex items-center text-[#FF873D]">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">{product.reviewCount} verified reviews</span>
              <span className="text-stone-500">·</span>
              <span className="text-[#C8FF35] font-bold">In Stock Pakistan Hub</span>
            </div>

            {/* Price Block */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                {formatPKR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-base font-mono text-stone-500 line-through tabular-nums">
                    {formatPKR(product.compareAtPrice)}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FF4F9A]/20 text-[#FF4F9A] font-bold border border-[#FF4F9A]/40">
                    Save {formatPKR(product.compareAtPrice - product.price)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Color Variant Selector */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-stone-300 block mb-2">
              Color: <b className="text-white">{selectedColor}</b>
            </span>
            <div className="flex gap-2">
              {product.colors.map((color) => {
                const isCurrent = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isCurrent
                        ? 'border-[#C8FF35] bg-stone-900 text-white font-bold'
                        : 'border-stone-800 bg-[#121016] text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shoe Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-300">
                Select Size (EU): <b className="text-[#C8FF35]">{selectedSize ? `EU ${selectedSize}` : 'None'}</b>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-mono text-[#FF4F9A] hover:underline flex items-center gap-1 font-bold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {product.availableSizes.map((size) => {
                const stock = product.stockPerSize[size] ?? 5;
                const isSizeOut = stock <= 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    disabled={isSizeOut}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    className={`py-3 rounded-xl font-mono text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                      isSizeOut
                        ? 'bg-stone-900 text-stone-600 border-stone-800 line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#C8FF35] text-[#17151C] border-[#C8FF35] shadow-lg shadow-[#C8FF35]/20 font-black'
                        : 'bg-[#121016] text-stone-300 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <span>{size}</span>
                    <span className="text-[9px] font-normal opacity-75">
                      {isSizeOut ? '0 left' : `${stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stock Advice */}
            <div className="mt-2 text-[11px] font-mono text-stone-400">
              {currentStockForSize > 0 && currentStockForSize <= 3 ? (
                <span className="text-[#FF873D] font-bold">
                  🔥 Low stock! Only {currentStockForSize} pairs available in EU {selectedSize}.
                </span>
              ) : (
                <span>Ready for immediate courier dispatch in Pakistan.</span>
              )}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-stone-400">QUANTITY:</span>
            <div className="flex items-center border border-stone-700 rounded-xl bg-stone-900 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-stone-400 hover:bg-stone-800 hover:text-white font-mono text-sm"
              >
                -
              </button>
              <span className="px-4 py-2 font-mono font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStockForSize || 1, q + 1))}
                className="px-3 py-2 text-stone-400 hover:bg-stone-800 hover:text-white font-mono text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-[#C8FF35]/25 disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white border border-stone-700 font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              BUY IT NOW (CASH ON DELIVERY)
            </button>

            {/* WhatsApp Direct Product Inquiry */}
            <a
              href={whatsappInquiry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-600/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Inquire About This Pair on WhatsApp</span>
            </a>
          </div>

          {/* Pakistan Delivery & COD Perks */}
          <div className="p-4 rounded-2xl bg-[#121016] border border-stone-800 space-y-2.5 text-xs text-stone-300">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#C8FF35] shrink-0" />
              <span>Standard delivery 3–4 days (PKR 450 or FREE over PKR 15k).</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FF873D] shrink-0" />
              <span>100% Cash on Delivery (COD) supported nationwide.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#FF4F9A] shrink-0" />
              <span>7-day free size swap with doorstep reverse courier.</span>
            </div>
          </div>

          {/* Accordion: Description, Materials & Shipping */}
          <div className="border-t border-stone-800 divide-y divide-stone-800 text-xs">
            
            {/* Description Details */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                className="w-full flex items-center justify-between text-left font-bold text-white py-1"
              >
                <span>SNEAKER OVERVIEW & TECH</span>
                {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4 text-[#C8FF35]" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openAccordion === 'desc' && (
                <div className="pt-2 text-stone-400 space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-4 space-y-1 text-stone-300">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Materials & Care */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
                className="w-full flex items-center justify-between text-left font-bold text-white py-1"
              >
                <span>MATERIALS & MAINTENANCE</span>
                {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4 text-[#C8FF35]" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openAccordion === 'materials' && (
                <div className="pt-2 text-stone-400 space-y-2 leading-relaxed">
                  <p><b className="text-white">Materials:</b> {product.materials}</p>
                  <p><b className="text-white">Care Guide:</b> {product.care}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                className="w-full flex items-center justify-between text-left font-bold text-white py-1"
              >
                <span>PAKISTAN DISPATCH & RETURNS</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-[#C8FF35]" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-2 text-stone-400 space-y-2 leading-relaxed">
                  <p>Dispatched from SOLEVERSE Clifton Hub in double-walled collector boxes. Track your parcel anytime with your Trax consignment number.</p>
                  <p>Returns accepted within 7 days in original unworn condition with tags attached.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-stone-800 pt-12 text-left">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF873D]">
              Customer Experiences
            </span>
            <h3 className="text-2xl font-black font-display text-white mt-1">
              REVIEWS FOR {product.name.toUpperCase()}
            </h3>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-black text-white">{product.rating}</span>
            <span className="text-xs text-stone-400 block">/ 5.0 (Demo Verified)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#17151C] border border-stone-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white">{rev.userName} ({rev.userCity})</span>
                  <span className="font-mono text-stone-400">{rev.date}</span>
                </div>
                <div className="flex text-[#FF873D] text-xs mb-2">
                  {'★'.repeat(rev.rating)}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>
                <span className="text-[10px] font-mono text-emerald-400 block mt-3">
                  ✓ Verified Streetwear Purchase (Demo)
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 rounded-2xl bg-[#17151C] border border-stone-800 text-center text-xs text-stone-400">
              Be the first in Pakistan to rock this new release and submit a review!
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-stone-800 pt-12 text-left">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#542C70]">
              Complete Your Fit
            </span>
            <h3 className="text-2xl font-black font-display text-white mt-1">
              YOU MIGHT ALSO LIKE
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
        currentSelectedSize={selectedSize || undefined}
      />

    </div>
  );
};
