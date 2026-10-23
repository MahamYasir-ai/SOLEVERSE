import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { useNavigate } from '../context/NavigationContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';

export const SearchResultsPage: React.FC = () => {
  const { queryParams, navigate } = useNavigate();
  const rawQuery = queryParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(rawQuery);
  const [activeQuery, setActiveQuery] = useState(rawQuery);
  const [selectedSort, setSelectedSort] = useState('featured');

  const cleanQuery = activeQuery.trim().toLowerCase();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput);
    navigate(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  const results = useMemo(() => {
    if (!cleanQuery) return PRODUCTS.slice(0, 12);

    return PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(cleanQuery) ||
        p.brand.toLowerCase().includes(cleanQuery) ||
        p.categoryLabel.toLowerCase().includes(cleanQuery) ||
        p.sku.toLowerCase().includes(cleanQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
        p.colors.some((c) => c.name.toLowerCase().includes(cleanQuery)) ||
        p.vibe.toLowerCase().includes(cleanQuery)
      );
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [cleanQuery, selectedSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* Search Header Form */}
      <div className="max-w-3xl mx-auto space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search sneakers, SKU, color (e.g. Lime, Chunky, SV-001)..."
              className="w-full bg-[#17151C] border border-stone-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-[#FAF8F4] placeholder-stone-500 focus:outline-none focus:border-[#C8FF35] shadow-lg transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider font-mono transition-colors shadow-lg shadow-[#C8FF35]/15"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-between text-xs font-mono text-stone-400">
          <span>
            {cleanQuery ? (
              <>
                RESULTS FOR &quot;<b className="text-white">{activeQuery}</b>&quot; — <b className="text-[#C8FF35]">{results.length}</b> DROPS FOUND
              </>
            ) : (
              'ALL FEATURED DROPS'
            )}
          </span>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-[#17151C] border border-stone-800 rounded-xl px-2.5 py-1 text-xs font-mono text-stone-300 focus:border-[#C8FF35] focus:outline-none"
          >
            <option value="featured">Featured Match</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#17151C] rounded-3xl border border-stone-800 p-8 space-y-4 max-w-lg mx-auto shadow-xl">
          <h3 className="text-xl font-bold font-display text-white">
            No exact matches for &quot;{activeQuery}&quot;
          </h3>
          <p className="text-xs text-stone-400">
            Try searching for broad terms like &quot;Valkyrie&quot;, &quot;Chunky&quot;, &quot;Hoops&quot;, or &quot;Retro&quot;.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Valkyrie', 'Chunky', 'Retro', 'Everyday', 'Black'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchInput(tag);
                  setActiveQuery(tag);
                }}
                className="px-3 py-1 bg-stone-900 border border-stone-700 rounded-lg text-xs font-mono text-stone-300 hover:bg-[#C8FF35] hover:text-[#17151C] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
