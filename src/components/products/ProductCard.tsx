import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatPKR } from '../../lib/currency';
import { useNavigate } from '../../context/NavigationContext';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate } = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isSaved = isInWishlist(product.id);
  // Keep the exact same primary image consistently to avoid showing a different shoe on hover!
  const shoeImage = product.images[0];

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  const handleQuickAdd = (size: number, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, size, product.colors[0]?.name, 1);
    setShowQuickSizes(false);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseLeave={() => setShowQuickSizes(false)}
      className="group relative flex flex-col bg-[#17151C] border border-stone-800/90 hover:border-[#C8FF35]/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#C8FF35]/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left"
    >
      {/* Visual Image Stage (Dark Club Showcase) */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-[#1C1A24] to-[#121017] overflow-hidden flex items-center justify-center border-b border-stone-800/60">
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-[#17151C]/80 backdrop-blur-md text-stone-300 hover:text-[#FF4F9A] hover:bg-[#17151C] border border-stone-700/60 transition-transform active:scale-90"
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'text-[#FF4F9A] fill-[#FF4F9A]' : ''}`} />
        </button>

        {/* Distinctive Single Badge Tag */}
        {product.isLimitedEdition ? (
          <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-mono tracking-wider uppercase font-bold text-white bg-[#542C70] border border-[#FF4F9A]/30 px-2.5 py-0.5 rounded-md shadow-md">
            Limited Drop
          </span>
        ) : product.isNew ? (
          <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-mono tracking-wider uppercase font-bold text-[#17151C] bg-[#C8FF35] px-2.5 py-0.5 rounded-md shadow-md font-black">
            Drop 01
          </span>
        ) : product.isOnSale ? (
          <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-mono tracking-wider uppercase font-bold text-white bg-[#FF4F9A] px-2.5 py-0.5 rounded-md shadow-md font-bold">
            Sale
          </span>
        ) : null}

        {/* Product Image: Always shows the EXACT same shoe, with slick scale zoom on hover */}
        {!imageError ? (
          <img
            src={shoeImage}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-900 text-stone-300 text-center">
            <span className="text-2xl font-black text-[#C8FF35] mb-1 font-display">
              SOLEVERSE
            </span>
            <span className="text-xs font-mono uppercase text-stone-400">
              {product.categoryLabel}
            </span>
          </div>
        )}

        {/* Quick Size Flyout Overlay */}
        {showQuickSizes && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 p-3.5 bg-[#17151C]/95 backdrop-blur-md z-20 flex flex-col gap-2 border-t border-stone-700 animate-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-300">
              <span className="text-[#C8FF35] font-bold">PICK SIZE (EU):</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickSizes(false);
                }}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.availableSizes.map((size) => {
                const stock = product.stockPerSize[size] ?? 5;
                const isOutOfStock = stock <= 0;
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={(e) => handleQuickAdd(size, e)}
                    className={`flex-1 min-w-[36px] py-1 text-center text-xs font-mono font-bold rounded-lg transition-colors ${
                      isOutOfStock
                        ? 'bg-stone-900 text-stone-600 line-through cursor-not-allowed border border-stone-800'
                        : 'bg-stone-800 hover:bg-[#C8FF35] text-white hover:text-[#17151C] border border-stone-700'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#17151C]">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-stone-400 uppercase mb-1.5">
            <span className="text-[#C8FF35] font-semibold">{product.brand}</span>
            <span className="text-stone-500">{product.categoryLabel}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#C8FF35] transition-colors line-clamp-1 font-display">
            {product.name}
          </h3>

          {/* Colorways */}
          <p className="text-xs text-stone-400 mt-1 line-clamp-1">
            {product.colors.map((c) => c.name).join(' · ')}
          </p>
        </div>

        {/* Price & Quick Add Button */}
        <div className="mt-5 pt-3.5 border-t border-stone-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-black text-white text-base sm:text-lg tabular-nums">
                {formatPKR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono text-xs text-stone-500 line-through tabular-nums">
                  {formatPKR(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickSizes(!showQuickSizes);
            }}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-[#C8FF35] text-stone-300 hover:text-[#17151C] border border-stone-700/80 transition-colors shadow-sm"
            title="Quick add to bag"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
