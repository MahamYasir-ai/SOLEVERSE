import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, ArrowUpDown, RefreshCw, Check } from 'lucide-react';
import { useNavigate } from '../context/NavigationContext';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST, PRODUCTS, VIBES_LIST } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { CategorySlug, Gender, Product, VibeType } from '../types';
import { SNEAKER_SIZES } from '../data/config';
import { formatPKR } from '../lib/currency';

interface ShopPageProps {
  initialCategory?: CategorySlug;
  onlyNew?: boolean;
  onlyBestSeller?: boolean;
  onlySale?: boolean;
  initialGender?: Gender;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  onlyNew,
  onlyBestSeller,
  onlySale,
  initialGender,
  titleOverride,
  subtitleOverride,
}) => {
  const { queryParams, navigate } = useNavigate();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(
    initialCategory || (queryParams.get('category') as CategorySlug) || 'all'
  );
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>(
    initialGender || (queryParams.get('gender') as Gender) || 'all'
  );
  const [selectedVibe, setSelectedVibe] = useState<string>(
    queryParams.get('vibe') || 'all'
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(
    queryParams.get('size') ? parseInt(queryParams.get('size')!, 10) : null
  );
  const [maxPrice, setMaxPrice] = useState<number>(36000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(Boolean(onlySale));
  const [onlyNewDrops, setOnlyNewDrops] = useState<boolean>(Boolean(onlyNew));
  const [sortBy, setSortBy] = useState<string>(
    onlyBestSeller ? 'best-selling' : 'featured'
  );

  // Compute active filters count
  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedGender !== 'all',
    selectedVibe !== 'all',
    selectedSize !== null,
    maxPrice < 36000,
    onlyInStock,
    onlyOnSale && !onlySale,
    onlyNewDrops && !onlyNew,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedVibe('all');
    setSelectedSize(null);
    setMaxPrice(36000);
    setOnlyInStock(false);
    if (!onlySale) setOnlyOnSale(false);
    if (!onlyNew) setOnlyNewDrops(false);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Gender filter
      if (selectedGender !== 'all' && product.gender !== selectedGender && product.gender !== 'Unisex') {
        return false;
      }
      // Vibe filter
      if (selectedVibe !== 'all' && product.vibe !== selectedVibe) {
        return false;
      }
      // Size filter
      if (selectedSize !== null) {
        if (!product.availableSizes.includes(selectedSize) || (product.stockPerSize[selectedSize] ?? 0) <= 0) {
          return false;
        }
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // In stock only
      if (onlyInStock && product.totalStock <= 0) {
        return false;
      }
      // Sale only
      if ((onlySale || onlyOnSale) && !product.isOnSale) {
        return false;
      }
      // New only
      if ((onlyNew || onlyNewDrops) && !product.isNew) {
        return false;
      }
      // Best Seller
      if (onlyBestSeller && !product.isBestSeller) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // featured default
    });
  }, [
    selectedCategory,
    selectedGender,
    selectedVibe,
    selectedSize,
    maxPrice,
    onlyInStock,
    onlyOnSale,
    onlySale,
    onlyNewDrops,
    onlyNew,
    onlyBestSeller,
    sortBy,
  ]);

  const pageTitle = titleOverride || (
    onlySale ? 'SALE HEAT' :
    onlyNew ? 'DROP 001 ARRIVALS' :
    onlyBestSeller ? 'BEST SELLERS' :
    selectedCategory !== 'all' ? CATEGORIES_LIST.find(c => c.slug === selectedCategory)?.name || 'Sneakers' :
    'ALL SNEAKERS'
  );

  const pageSubtitle = subtitleOverride || (
    onlySale ? 'Score archive colorways and limited releases with up to 30% discount.' :
    onlyNew ? 'The freshest additions to the SOLEVERSE rotation straight from the design lab.' :
    selectedCategory !== 'all' ? (CATEGORIES_LIST.find(c => c.slug === selectedCategory)?.description || 'Explore our authenticated silhouettes with nationwide Cash on Delivery.') :
    'Explore 70 engineered silhouettes with nationwide Cash on Delivery in Pakistan.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left bg-[#0E0D12] text-[#FAF8F4]">
      {/* Page Header */}
      <div className="border-b border-stone-800 pb-8 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
          SOLEVERSE Vault Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mt-1 uppercase">
          {pageTitle}
        </h1>
        <p className="text-sm text-stone-400 mt-2 max-w-2xl">
          {pageSubtitle}
        </p>
      </div>

      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl bg-[#17151C] border border-stone-700 text-white font-bold text-xs flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C8FF35]" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          <span className="text-xs font-mono text-stone-400">
            SHOWING <b className="text-[#C8FF35]">{filteredProducts.length}</b> DROPS
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-mono text-stone-400 hidden sm:inline">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#17151C] border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#C8FF35]"
          >
            <option value="featured">Featured Curations</option>
            <option value="newest">Newest Releases</option>
            <option value="best-selling">Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-[#17151C] border border-stone-800 text-xs">
          <span className="font-mono text-stone-400 uppercase text-[11px]">Active:</span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] flex items-center gap-1 font-mono"
            >
              Category: {selectedCategory} ✕
            </button>
          )}
          {selectedGender !== 'all' && (
            <button
              onClick={() => setSelectedGender('all')}
              className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] flex items-center gap-1 font-mono"
            >
              Gender: {selectedGender} ✕
            </button>
          )}
          {selectedVibe !== 'all' && (
            <button
              onClick={() => setSelectedVibe('all')}
              className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] flex items-center gap-1 font-mono"
            >
              Vibe: {selectedVibe} ✕
            </button>
          )}
          {selectedSize !== null && (
            <button
              onClick={() => setSelectedSize(null)}
              className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] flex items-center gap-1 font-mono"
            >
              Size: EU {selectedSize} ✕
            </button>
          )}
          {maxPrice < 36000 && (
            <button
              onClick={() => setMaxPrice(36000)}
              className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] flex items-center gap-1 font-mono"
            >
              Max: {formatPKR(maxPrice)} ✕
            </button>
          )}
          {onlyInStock && (
            <button
              onClick={() => setOnlyInStock(false)}
              className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-[#FF4F9A] flex items-center gap-1 font-mono"
            >
              In Stock Only ✕
            </button>
          )}

          <button
            onClick={clearAllFilters}
            className="ml-auto text-[#FF4F9A] hover:underline text-xs font-mono"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Desktop Sidebar Filter + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters (Dark Club Aesthetic) */}
        <aside className="hidden lg:block space-y-8 pr-4">
          
          {/* Categories */}
          <div className="p-5 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-[#C8FF35]">
              Silhouette Category
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-2 px-3 rounded-xl transition-colors flex justify-between ${
                  selectedCategory === 'all' ? 'bg-[#C8FF35] text-[#17151C] font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>All Silhouettes</span>
                <span>{PRODUCTS.length}</span>
              </button>
              {CATEGORIES_LIST.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug as CategorySlug)}
                    className={`w-full text-left py-2 px-3 rounded-xl transition-colors flex justify-between items-center ${
                      selectedCategory === cat.slug ? 'bg-[#C8FF35] text-[#17151C] font-bold' : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-md ${selectedCategory === cat.slug ? 'bg-[#17151C] text-[#C8FF35]' : 'bg-stone-900 text-stone-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shoe Size Filter */}
          <div className="p-5 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-[#C8FF35]">
                Shoe Size (EU)
              </h4>
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize(null)}
                  className="text-[11px] text-stone-400 hover:text-white underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {SNEAKER_SIZES.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(isSelected ? null : size)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl transition-colors border ${
                      isSelected
                        ? 'bg-[#C8FF35] text-[#17151C] border-[#C8FF35] font-black'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Mood / Vibe */}
          <div className="p-5 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-[#C8FF35]">
              Style Mood / Vibe
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedVibe('all')}
                className={`w-full text-left py-1.5 px-3 rounded-xl ${selectedVibe === 'all' ? 'font-bold text-white bg-stone-800' : 'text-stone-400 hover:text-white'}`}
              >
                All Vibes
              </button>
              {VIBES_LIST.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVibe(v.id)}
                  className={`w-full text-left py-1.5 px-3 rounded-xl flex items-center justify-between ${
                    selectedVibe === v.id ? 'font-bold text-[#C8FF35] bg-stone-800' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{v.label}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="p-5 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-[#C8FF35]">
                Max Price
              </h4>
              <span className="text-xs font-mono font-bold text-white">
                {formatPKR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="8000"
              max="36000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-[#C8FF35]"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-500">
              <span>PKR 8k</span>
              <span>PKR 36k</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="p-5 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-300">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#C8FF35] bg-stone-800 border-stone-700 focus:ring-0"
              />
              <span className="font-medium">In Stock Pairs Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-stone-300">
              <input
                type="checkbox"
                checked={onlyOnSale}
                onChange={(e) => setOnlyOnSale(e.target.checked)}
                className="w-4 h-4 rounded text-[#C8FF35] bg-stone-800 border-stone-700 focus:ring-0"
              />
              <span className="font-medium">On Sale Drops Only</span>
            </label>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#17151C] rounded-3xl border border-stone-800 p-8 space-y-4">
              <h3 className="text-xl font-bold font-display text-white">
                No sneakers match your exact criteria
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try widening your price range, clearing size filters, or exploring all silhouettes.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-xl bg-[#C8FF35] text-[#17151C] font-black text-xs uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>

      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-[#17151C] text-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto border-l border-stone-800">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <h3 className="font-bold text-lg font-display text-white">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase font-bold text-[#C8FF35] mb-2">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs flex justify-between items-center ${selectedCategory === 'all' ? 'bg-[#C8FF35] text-[#17151C] font-bold' : 'text-stone-300 hover:bg-stone-800'}`}
                >
                  <span>All Categories</span>
                  <span className="font-mono text-[10px] text-stone-400">{PRODUCTS.length}</span>
                </button>
                {CATEGORIES_LIST.map((cat) => {
                  const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug as CategorySlug)}
                      className={`w-full text-left py-2 px-3 rounded-xl text-xs flex justify-between items-center ${selectedCategory === cat.slug ? 'bg-[#C8FF35] text-[#17151C] font-bold' : 'text-stone-300 hover:bg-stone-800'}`}
                    >
                      <span>{cat.name}</span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${selectedCategory === cat.slug ? 'bg-[#17151C] text-[#C8FF35]' : 'bg-stone-900 text-stone-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Size */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase font-bold text-[#C8FF35] mb-2">Size (EU)</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {SNEAKER_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border ${
                      selectedSize === size ? 'bg-[#C8FF35] text-[#17151C] border-[#C8FF35]' : 'bg-stone-900 text-stone-300 border-stone-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-auto w-full py-3.5 rounded-2xl bg-[#C8FF35] text-[#17151C] font-black text-xs uppercase tracking-wider"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
