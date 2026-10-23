import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, Tag } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { formatPKR } from '../../lib/currency';
import { useNavigate } from '../../context/NavigationContext';
import { getFromStorage, saveToStorage } from '../../lib/storage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_RECENT_SEARCHES = 'soleverse_recent_searches_v1';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useNavigate();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getFromStorage<string[]>(STORAGE_RECENT_SEARCHES, ['Valkyrie', 'Chunky', 'Lime', 'Court']));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Filter products by name, brand, category, tags, sku, colors
  const searchResults = cleanQuery
    ? PRODUCTS.filter((p) => {
        return (
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brand.toLowerCase().includes(cleanQuery) ||
          p.categoryLabel.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
          p.colors.some((c) => c.name.toLowerCase().includes(cleanQuery))
        );
      }).slice(0, 8)
    : [];

  const handleSelectProduct = (product: Product) => {
    saveSearchTerm(product.name);
    onClose();
    navigate(`/products/${product.slug}`);
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      saveSearchTerm(query.trim());
      onClose();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const saveSearchTerm = (term: string) => {
    const updated = [term, ...recentSearches.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    saveToStorage(STORAGE_RECENT_SEARCHES, updated);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    saveToStorage(STORAGE_RECENT_SEARCHES, []);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-[#17151C] text-[#FAF8F4] border border-stone-700 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C8FF35] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleViewAllResults()}
            placeholder="Search drops, silhouettes, SKU, color (e.g. Lime, Chunky, SV-FUT)..."
            className="flex-1 bg-transparent text-base sm:text-lg text-white placeholder-stone-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-800/60">
          {cleanQuery ? (
            searchResults.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>FOUND {searchResults.length} DROPS MATCHING &quot;{query}&quot;</span>
                  <button
                    onClick={handleViewAllResults}
                    className="text-[#C8FF35] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Full Results Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2.5 rounded-2xl hover:bg-stone-900 border border-transparent hover:border-stone-800 flex items-center gap-4 transition-all cursor-pointer group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover bg-stone-900 shrink-0 border border-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase text-[#C8FF35]">
                            {product.categoryLabel}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500">
                            {product.sku}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#C8FF35] transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-stone-400 truncate">
                          {product.colors.map((c) => c.name).join(' · ')}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sm text-[#FAF8F4] block">
                          {formatPKR(product.price)}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {product.totalStock} in stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <p className="text-stone-300 font-medium">
                  No sneakers found matching &quot;{query}&quot;
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try searching for &quot;Valkyrie&quot;, &quot;Chunky&quot;, &quot;Retro&quot;, &quot;Court&quot;, or &quot;Platform&quot;.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  {['Valkyrie', 'Chunky', 'Retro', 'White Sneaker', 'Platform'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs px-3 py-1 rounded-lg bg-stone-800 hover:bg-[#C8FF35] hover:text-[#17151C] text-stone-300 font-mono transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-3">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecent}
                      className="text-stone-500 hover:text-stone-300 text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 hover:text-[#C8FF35] hover:border-[#C8FF35]/40 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Heat Suggestions */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-3">
                  Trending Silhouettes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Valkyrie Chrono-Core 01', category: 'futuristic-kicks' },
                    { label: 'Titan Strata Chunky', category: 'chunky-sneakers' },
                    { label: 'Mono Court Clean White', category: 'everyday-essentials' },
                    { label: 'Echo 84 Trackster', category: 'retro-runners' },
                    { label: 'Elevate Platform Lug', category: 'platform-sneakers' },
                    { label: 'Court Dynasty High', category: 'basketball' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setQuery(item.label)}
                      className="p-3 text-left rounded-xl bg-stone-900/60 border border-stone-800/80 hover:border-stone-700 hover:bg-stone-800/50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white block line-clamp-1">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#C8FF35]">
                        Popular drop
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
