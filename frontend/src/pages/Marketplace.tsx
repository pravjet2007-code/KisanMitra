import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, Star, CheckCircle2, Users,
  ChevronDown, Leaf, Package,
  TrendingUp, ArrowRight, Loader2, ChevronLeft, ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Marketplace() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price-low');
  const [minScore, setMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced Filter states
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [farmingMethod, setFarmingMethod] = useState<string>('All');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 9;

  // Fetch active categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/products/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Reset pagination to first page when search or any filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy, minScore, selectedCategoryId, minPrice, maxPrice, farmingMethod]);

  // Fetch products from database using all filters and search query parameters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * limit;
        
        const params = new URLSearchParams({
          skip: skip.toString(),
          limit: limit.toString(),
          sort_by: sortBy === 'price-low' ? 'price_asc' : sortBy === 'price-high' ? 'price_desc' : sortBy === 'score' ? 'score' : 'newest'
        });

        // Search query q combines free text search and selected quick crop shortcuts
        let qParam = searchQuery;
        if (selectedCategory !== 'All') {
          qParam = qParam ? `${qParam} ${selectedCategory}` : selectedCategory;
        }
        if (qParam) params.append('q', qParam);

        // Append dynamic database filters
        if (selectedCategoryId !== 'All') {
          params.append('category_id', selectedCategoryId.toString());
        }
        if (minPrice) {
          params.append('min_price', minPrice);
        }
        if (maxPrice) {
          params.append('max_price', maxPrice);
        }
        if (farmingMethod !== 'All') {
          params.append('farming_method', farmingMethod);
        }
        if (minScore > 0) {
          params.append('min_rating', minScore.toString());
        }

        const response = await fetch(`http://localhost:8000/api/v1/products/?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data.items);
        setTotalPages(data.pages);
        setTotalItems(data.total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search/filter calls by 300ms for high performance
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, sortBy, minScore, selectedCategoryId, minPrice, maxPrice, farmingMethod, page]);

  const getImageUrl = (product: any) => {
    if (product.image_url) {
      if (product.image_url.startsWith('http')) return product.image_url;
      return `http://localhost:8000${product.image_url}`;
    }
    const name = product.name.toLowerCase();
    if (name.includes('wheat')) return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80';
    if (name.includes('rice')) return 'https://images.unsplash.com/photo-1536304993881-070a87e2ffab?w=600&q=80';
    if (name.includes('mustard')) return 'https://images.unsplash.com/photo-1501004318776-cd2ba4e68be1?w=600&q=80';
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80';
  };

  const isAnyFilterActive = 
    selectedCategory !== 'All' ||
    selectedCategoryId !== 'All' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    farmingMethod !== 'All' ||
    minScore !== 0;

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedCategoryId('All');
    setMinPrice('');
    setMaxPrice('');
    setFarmingMethod('All');
    setMinScore(0);
    setSortBy('price-low');
  };

  return (
    <div className="min-h-screen bg-offwhite pt-20 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            {t('marketplace.title', 'KISAN MITRA Marketplace')}
          </h1>
          <p className="text-white/50 text-lg mb-6 max-w-xl">
            {t('marketplace.subtitle', 'Browse verified farm listings with quality data, soil reports, and Farmer Score.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input type="text" placeholder={t('marketplace.searchPlaceholder', 'Search crops, locations...')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl text-sm bg-white shadow-lg focus:ring-2 focus:ring-terracotta/30 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="px-5 py-4 bg-white/15 text-white rounded-xl font-medium hover:bg-white/25 transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/15">
              <Filter className="w-5 h-5" /> {t('marketplace.filters', 'Filters')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8 transition-all duration-300">
          {/* Top Row: Crop Shortcuts, Sort & Toggles */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Quick Crop Shortcuts */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider mr-1 hidden lg:inline">
                {t('marketplace.quickCrops', 'Quick Crops')}:
              </span>
              {['All', 'Wheat', 'Rice', 'Mustard', 'Soybean', 'Chickpea'].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-terracotta text-white shadow-sm scale-102 font-semibold' 
                      : 'bg-light text-dark hover:bg-border/60 hover:scale-102'
                  }`}
                >
                  {t(`marketplaceContext.categories.${cat.toLowerCase()}`, cat)}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 ml-auto flex-wrap sm:flex-nowrap">
              {/* Sort By Select */}
              <div className="relative min-w-[160px]">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full appearance-none bg-light rounded-xl px-4 py-2.5 pr-10 text-sm text-dark cursor-pointer focus:ring-2 focus:ring-terracotta/20 outline-none border border-border transition-all"
                >
                  <option value="price-low">{t('marketplace.priceLow', 'Price: Low → High')}</option>
                  <option value="price-high">{t('marketplace.priceHigh', 'Price: High → Low')}</option>
                  <option value="score">{t('marketplace.scoreTitle', 'Farmer Score')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>

              {/* Advanced Filters Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
                  showFilters || isAnyFilterActive
                    ? 'bg-sage/10 text-sage border-sage/30 shadow-xs' 
                    : 'bg-white text-dark border-border hover:bg-light'
                }`}
              >
                <Filter className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-90 text-sage' : ''}`} />
                <span>{t('marketplace.advancedFilters', 'Filters')}</span>
                {isAnyFilterActive && (
                  <span className="w-2 h-2 bg-sage rounded-full animate-pulse" />
                )}
              </button>

              {/* Reset Button */}
              {isAnyFilterActive && (
                <button 
                  onClick={handleClearFilters}
                  className="p-2.5 rounded-xl border border-danger/20 text-danger bg-danger/5 hover:bg-danger/10 hover:border-danger/30 transition-all flex items-center justify-center"
                  title={t('marketplace.clearFilters', 'Reset Filters')}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="text-sm font-medium text-muted">
                {totalItems} <span className="text-xs text-muted/80">{t('marketplace.listings', 'listings')}</span>
              </div>
            </div>
          </div>

          {/* Premium Collapsible Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
              {/* Category Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">{t('marketplace.category', 'Category')}</label>
                <div className="relative">
                  <select 
                    value={selectedCategoryId} 
                    onChange={(e) => setSelectedCategoryId(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                    className="w-full appearance-none bg-light rounded-xl px-4 py-2.5 pr-10 text-sm text-dark cursor-pointer focus:ring-2 focus:ring-terracotta/20 outline-none border border-border"
                  >
                    <option value="All">{t('marketplace.allCategories', 'All Categories')}</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {t(`marketplaceContext.categories.${cat.name.toLowerCase().replace(/\s+/g, '_')}`, cat.name) as string}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">{t('marketplace.priceRange', 'Price Range')}</label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">₹</span>
                    <input 
                      type="number" 
                      placeholder={t('marketplace.min', 'Min')} 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm bg-light border border-border outline-none focus:ring-2 focus:ring-terracotta/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <span className="text-muted text-xs font-semibold">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">₹</span>
                    <input 
                      type="number" 
                      placeholder={t('marketplace.max', 'Max')} 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm bg-light border border-border outline-none focus:ring-2 focus:ring-terracotta/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>

              {/* Farming Method Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">{t('marketplace.farmingMethod', 'Farming Method')}</label>
                <div className="flex bg-light p-1 rounded-xl border border-border h-[38px] items-center">
                  {[
                    { value: 'All', label: t('marketplace.any', 'Any') },
                    { value: 'organic', label: t('marketplace.organic', 'Organic') },
                    { value: 'traditional', label: t('marketplace.traditional', 'Traditional') }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setFarmingMethod(method.value)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                        farmingMethod === method.value
                          ? 'bg-white text-sage shadow-xs border border-border/40 font-bold'
                          : 'text-muted hover:text-dark'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Farmer Score Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">{t('marketplace.minScore', 'Min Farmer Score')}</label>
                <div className="flex items-center gap-1.5 h-[38px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setMinScore(minScore === star ? 0 : star)}
                      className="focus:outline-none transition-transform active:scale-95"
                      title={`${star} stars and above`}
                    >
                      <Star 
                        className={`w-5 h-5 transition-all ${
                          star <= minScore 
                            ? 'text-amber fill-amber scale-110 drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]' 
                            : 'text-muted/40 hover:text-amber/70'
                        }`} 
                      />
                    </button>
                  ))}
                  {minScore > 0 && (
                    <span className="text-xs font-semibold text-amber ml-1.5 bg-amber/10 px-2 py-0.5 rounded-full">
                      {minScore}.0+
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-terracotta" />
          </div>
        ) : error ? (
           <div className="text-center py-20">
             <p className="text-red-500">{error}</p>
           </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-black mb-2">{t('marketplace.noListingsTitle', 'No listings found')}</h3>
            <p className="text-muted">{t('marketplace.noListingsDesc', 'Adjust your filters or search query.')}</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {products.map((product) => (
                <Link to={`/listing/${product.product_id}`} key={product.product_id} className="bg-white rounded-2xl shadow-xs border border-border overflow-hidden card-hover group">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" title="Verified">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </span>
                      {product.farming_method === 'organic' && (
                        <span className="w-7 h-7 bg-amber/30 rounded-lg flex items-center justify-center backdrop-blur-sm" title="Organic">
                          <Leaf className="w-4 h-4 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs text-white/70 uppercase tracking-wider">{product.type || 'PRODUCE'}</span>
                      <h3 className="font-heading text-lg font-bold text-white">{product.name}</h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-baseline justify-between mb-4">
                      <p className="font-heading text-2xl font-bold text-black">₹{product.price_per_unit}<span className="text-sm font-normal text-muted">/{product.unit_of_measure}</span></p>
                      <span className="text-sm font-semibold text-sage">{product.stock_quantity} {product.unit_of_measure}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-offwhite rounded-lg p-2.5">
                        <p className="text-[10px] text-muted uppercase tracking-wider">{t('marketplaceContext.grade', 'Grade')}</p>
                        <p className="text-sm font-semibold text-black">A</p>
                      </div>
                      <div className="bg-offwhite rounded-lg p-2.5">
                        <p className="text-[10px] text-muted uppercase tracking-wider">{t('marketplaceContext.moisture', 'Shelf Life')}</p>
                        <p className="text-sm font-semibold text-black">{product.shelf_life_days || '-'} days</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-light">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-sage" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Star className="w-3 h-3 text-amber fill-amber" />
                          <span className="font-semibold text-dark">{product.average_rating || 0}</span>
                          <span>·</span>
                          <MapPin className="w-3 h-3" />
                          <span>Dist.</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-light rounded-lg flex items-center justify-center group-hover:bg-terracotta transition-colors">
                        <ArrowRight className="w-4 h-4 text-dark group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white border border-border text-dark hover:bg-light disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-dark px-4 py-2 bg-white border border-border rounded-xl">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white border border-border text-dark hover:bg-light disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Market Insights */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-xs border border-border">
          <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-terracotta" /> {t('marketplace.marketInsights', 'Market Insights')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { crop: t('marketplaceContext.crops.wheat', 'Wheat'), avg: '₹2,210/q', trend: '↑ 5.2%', positive: true },
              { crop: t('marketplaceContext.crops.rice', 'Rice'), avg: '₹3,500/q', trend: '↑ 2.8%', positive: true },
              { crop: t('marketplaceContext.crops.mustard', 'Mustard'), avg: '₹5,050/q', trend: '↓ 1.5%', positive: false },
              { crop: t('marketplaceContext.crops.soybean', 'Soybean'), avg: '₹4,150/q', trend: '↑ 3.1%', positive: true },
            ].map((insight, i) => (
              <div key={i} className="bg-offwhite border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted">{insight.crop}</p>
                <p className="font-heading text-xl font-bold text-black mt-1">{insight.avg}</p>
                <p className={`text-xs font-medium mt-1 ${insight.positive ? 'text-sage' : 'text-danger'}`}>{insight.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
