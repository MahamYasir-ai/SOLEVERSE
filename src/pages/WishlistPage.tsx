import React, { useState } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from '../context/NavigationContext';
import { formatPKR } from '../lib/currency';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, toggleWishlist, addToCart } = useStore();
  const { navigate } = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

  const handleSizeSelect = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleMoveToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.availableSizes[0] || 42;
    addToCart(product, size, product.colors[0]?.name, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* Header */}
      <div className="border-b border-stone-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
            Saved Soles · Rotation Vault
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
            WISHLIST ({wishlistProducts.length})
          </h1>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="text-xs font-mono font-bold text-[#C8FF35] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-24 text-center bg-[#17151C] rounded-3xl border border-stone-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-stone-700 flex items-center justify-center mx-auto text-stone-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            No Sneakers Saved Yet
          </h2>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Click the heart icon on any shoe to save your top picks and build your dream sneaker rotation.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C8FF35]/15"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => {
            const currentChosenSize = selectedSizes[product.id] || product.availableSizes[0] || 42;

            return (
              <div
                key={product.id}
                className="bg-[#17151C] border border-stone-800 hover:border-[#C8FF35]/50 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between transition-all group"
              >
                {/* Image Stage */}
                <div
                  onClick={() => navigate(`/products/${product.slug}`)}
                  className="relative aspect-[4/3] bg-stone-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#17151C]/90 text-[#FF4F9A] hover:bg-[#FF4F9A] hover:text-white shadow-md transition-colors border border-stone-700"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#C8FF35]">
                      {product.brand} · {product.categoryLabel}
                    </span>
                    <h3
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="font-bold text-base text-white group-hover:text-[#C8FF35] cursor-pointer line-clamp-1 transition-colors mt-0.5"
                    >
                      {product.name}
                    </h3>
                    <div className="font-mono font-bold text-base text-[#FAF8F4] mt-1 tabular-nums">
                      {formatPKR(product.price)}
                    </div>
                  </div>

                  {/* Size Selector Before Adding to Cart */}
                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">
                      Choose Size (EU):
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {product.availableSizes.map((size) => {
                        const isSelected = currentChosenSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(product.id, size)}
                            className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                              isSelected
                                ? 'bg-[#C8FF35] text-[#17151C] font-black'
                                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Move to Cart CTA */}
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#C8FF35]/15"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
