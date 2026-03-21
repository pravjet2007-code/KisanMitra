import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, Star, CheckCircle2, Users,
  ChevronDown, Leaf, Package,
  TrendingUp, Plane, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Marketplace() {
  const { t } = useTranslation();

  const allListings = [
  { id: 1, farmer: t('marketplaceContext.farmer'), score: 4.7, location: t('marketplaceContext.locations.punjab'), distance: '52 km', crop: t('marketplaceContext.crops.wheat1'), qty: '18 Q', price: 2250, grade: 'A', moisture: '11.5%', verified: true, droneData: true, harvest: 'Mar 15', organic: false, category: 'wheat' },
  { id: 2, farmer: t('marketplaceContext.farmer'), score: 4.2, location: t('marketplaceContext.locations.punjab'), distance: '78 km', crop: t('marketplaceContext.crops.wheat2'), qty: '25 Q', price: 2180, grade: 'A', moisture: '12.1%', verified: true, droneData: false, harvest: 'Mar 18', organic: false, category: 'wheat' },
  { id: 3, farmer: t('marketplaceContext.farmer'), score: 4.9, location: t('marketplaceContext.locations.punjab'), distance: '35 km', crop: t('marketplaceContext.crops.wheat1'), qty: '12 Q', price: 2300, grade: 'A+', moisture: '11.2%', verified: true, droneData: true, harvest: 'Mar 12', organic: true, category: 'wheat' },
  { id: 4, farmer: t('marketplaceContext.farmer'), score: 4.5, location: t('marketplaceContext.locations.mp'), distance: '120 km', crop: t('marketplaceContext.crops.soybean'), qty: '30 Q', price: 4200, grade: 'A', moisture: '10.8%', verified: true, droneData: true, harvest: 'Mar 20', organic: false, category: 'soybean' },
  { id: 5, farmer: t('marketplaceContext.farmer'), score: 4.0, location: t('marketplaceContext.locations.mh'), distance: '95 km', crop: t('marketplaceContext.crops.rice1'), qty: '15 Q', price: 3800, grade: 'A', moisture: '13.0%', verified: false, droneData: false, harvest: 'Apr 5', organic: false, category: 'rice' },
  { id: 6, farmer: t('marketplaceContext.farmer'), score: 4.8, location: t('marketplaceContext.locations.punjab'), distance: '45 km', crop: t('marketplaceContext.crops.mustard'), qty: '10 Q', price: 5100, grade: 'A+', moisture: '8.5%', verified: true, droneData: true, harvest: 'Mar 8', organic: true, category: 'mustard' },
  { id: 7, farmer: t('marketplaceContext.farmer'), score: 3.8, location: t('marketplaceContext.locations.up'), distance: '200 km', crop: t('marketplaceContext.crops.chickpea'), qty: '20 Q', price: 4800, grade: 'B', moisture: '11.0%', verified: true, droneData: false, harvest: 'Mar 25', organic: false, category: 'chickpea' },
  { id: 8, farmer: t('marketplaceContext.farmer'), score: 4.6, location: t('marketplaceContext.locations.rj'), distance: '150 km', crop: t('marketplaceContext.crops.wheat3'), qty: '35 Q', price: 2100, grade: 'A', moisture: '11.8%', verified: true, droneData: true, harvest: 'Mar 22', organic: false, category: 'wheat' },
  { id: 9, farmer: t('marketplaceContext.farmer'), score: 4.3, location: t('marketplaceContext.locations.tl'), distance: '180 km', crop: t('marketplaceContext.crops.rice2'), qty: '40 Q', price: 3200, grade: 'A', moisture: '12.5%', verified: true, droneData: false, harvest: 'Apr 10', organic: false, category: 'rice' },
];

const categories = [t('marketplaceContext.categories.all'), t('marketplaceContext.categories.wheat'), t('marketplaceContext.categories.rice'), t('marketplaceContext.categories.mustard'), t('marketplaceContext.categories.soybean'), t('marketplaceContext.categories.chickpea')];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t('marketplaceContext.categories.all'));
  const [sortBy, setSortBy] = useState('price-low');
  const [minScore, setMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allListings
    .filter((l) => {
      const matchSearch = l.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         l.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === t('marketplaceContext.categories.all') || l.category === selectedCategory.toLowerCase();
      const matchScore = l.score >= minScore;
      return matchSearch && matchCategory && matchScore;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'distance') return parseInt(a.distance) - parseInt(b.distance);
      return 0;
    });

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
            {t('marketplace.title')}
          </h1>
          <p className="text-white/50 text-lg mb-6 max-w-xl">
            {t('marketplace.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input type="text" placeholder={t('marketplace.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl text-sm bg-white shadow-lg focus:ring-2 focus:ring-terracotta/30 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="px-5 py-4 bg-white/15 text-white rounded-xl font-medium hover:bg-white/25 transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/15">
              <Filter className="w-5 h-5" /> {t('marketplace.filters')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Filter Bar */}
        <div className={`bg-white rounded-2xl shadow-xs border border-border p-5 mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-terracotta text-white shadow-md' : 'bg-light text-dark hover:bg-border'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-light rounded-xl px-4 py-2.5 pr-10 text-sm text-dark cursor-pointer focus:ring-2 focus:ring-terracotta/20 outline-none border border-border">
                <option value="price-low">{t('marketplace.priceLow')}</option>
                <option value="price-high">{t('marketplace.priceHigh')}</option>
                <option value="score">{t('marketplace.scoreTitle')}</option>
                <option value="distance">{t('marketplace.distance')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber" />
              <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="appearance-none bg-light rounded-xl px-4 py-2.5 pr-10 text-sm text-dark cursor-pointer outline-none border border-border">
                <option value={0}>{t('marketplace.anyScore')}</option>
                <option value={4}>4.0+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </div>
            <div className="ml-auto text-sm text-muted">{filtered.length} {t('marketplace.listings')}</div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-black mb-2">{t('marketplace.noListingsTitle')}</h3>
            <p className="text-muted">{t('marketplace.noListingsDesc')}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((listing) => (
              <Link to={`/listing/${listing.id}`} key={listing.id} className="bg-white rounded-2xl shadow-xs border border-border overflow-hidden card-hover group">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${listing.category === 'wheat' ? '1574943320219-553eb213f72d' : listing.category === 'rice' ? '1536304993881-070a87e2ffab' : listing.category === 'mustard' ? '1501004318776-cd2ba4e68be1' : '1416879595882-3373a0480b5b'}?w=600&q=80`}
                    alt={listing.crop}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {listing.verified && (
                      <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" title="Verified">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </span>
                    )}
                    {listing.droneData && (
                      <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" title="Drone Data">
                        <Plane className="w-4 h-4 text-white" />
                      </span>
                    )}
                    {listing.organic && (
                      <span className="w-7 h-7 bg-amber/30 rounded-lg flex items-center justify-center backdrop-blur-sm" title="Organic">
                        <Leaf className="w-4 h-4 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs text-white/70 uppercase tracking-wider">{listing.category}</span>
                    <h3 className="font-heading text-lg font-bold text-white">{listing.crop}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="font-heading text-2xl font-bold text-black">₹{listing.price.toLocaleString()}<span className="text-sm font-normal text-muted">/q</span></p>
                    <span className="text-sm font-semibold text-sage">{listing.qty}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-offwhite rounded-lg p-2.5">
                      <p className="text-[10px] text-muted uppercase tracking-wider">{t('marketplaceContext.grade')}</p>
                      <p className="text-sm font-semibold text-black">{listing.grade}</p>
                    </div>
                    <div className="bg-offwhite rounded-lg p-2.5">
                      <p className="text-[10px] text-muted uppercase tracking-wider">{t('marketplaceContext.moisture')}</p>
                      <p className="text-sm font-semibold text-black">{listing.moisture}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-light">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-sage" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Star className="w-3 h-3 text-amber fill-amber" />
                        <span className="font-semibold text-dark">{listing.score}</span>
                        <span>·</span>
                        <MapPin className="w-3 h-3" />
                        <span>{listing.distance}</span>
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
        )}

        {/* Market Insights */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-xs border border-border">
          <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-terracotta" /> {t('marketplace.marketInsights')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { crop: t('marketplaceContext.crops.wheat'), avg: '₹2,210/q', trend: '↑ 5.2%', positive: true },
              { crop: t('marketplaceContext.crops.rice'), avg: '₹3,500/q', trend: '↑ 2.8%', positive: true },
              { crop: t('marketplaceContext.crops.mustard_gen'), avg: '₹5,050/q', trend: '↓ 1.5%', positive: false },
              { crop: t('marketplaceContext.crops.soybean_gen'), avg: '₹4,150/q', trend: '↑ 3.1%', positive: true },
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
