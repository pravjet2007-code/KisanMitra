import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import {
  Star, MapPin, CheckCircle2, Users, Leaf, Bug, Microscope,
  Droplets, Shield, CreditCard, Truck,
  ArrowLeft, MessageSquare, Calendar, Package, TrendingUp,
  ChevronRight, Download, Phone, Loader2
} from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'details' | 'quality' | 'farmer'>('details');
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('2250');
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/v1/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        // Set dynamic offer price to 95% of listing price as a reasonable starting offer
        const priceVal = parseFloat(data.price_per_unit) || 0;
        setOfferPrice(Math.round(priceVal * 0.95).toString());
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getImageUrl = (p: any) => {
    if (p.image_url) {
      if (p.image_url.startsWith('http')) return p.image_url;
      return `http://localhost:8000${p.image_url}`;
    }
    const name = p.name.toLowerCase();
    if (name.includes('wheat')) return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80';
    if (name.includes('rice')) return 'https://images.unsplash.com/photo-1536304993881-070a87e2ffab?w=1200&q=80';
    if (name.includes('mustard')) return 'https://images.unsplash.com/photo-1501004318776-cd2ba4e68be1?w=1200&q=80';
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80';
  };

  const formatHarvestDate = (dateStr?: string) => {
    if (!dateStr) return 'Ready to Ship';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-32 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-terracotta" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-offwhite pt-32 text-center">
        <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
        <Link to="/marketplace" className="text-terracotta hover:underline font-semibold">Back to Marketplace</Link>
      </div>
    );
  }

  const price = parseFloat(product.price_per_unit) || 0;
  const stock = parseFloat(product.stock_quantity) || 0;
  const totalValue = price * stock;
  const estTransport = Math.round(totalValue * 0.045) || 1800; // 4.5% of total value or default ₹1800
  const netTotal = totalValue + estTransport;

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/marketplace" className="text-terracotta hover:text-terracotta-dark flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Marketplace
          </Link>
          <ChevronRight className="w-4 h-4 text-muted" />
          <span className="text-muted capitalize">{product.type?.toLowerCase().replace('_', ' ')}</span>
          <ChevronRight className="w-4 h-4 text-muted" />
          <span className="text-dark font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-xs border border-border overflow-hidden mb-6">
              {/* Image header */}
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  {product.farming_method?.toLowerCase() === 'organic' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-sage text-xs text-white rounded-full font-semibold shadow-sm">
                      <Leaf className="w-3.5 h-3.5" /> Organic
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">
                    <Microscope className="w-3.5 h-3.5" /> Soil Report
                  </span>
                </div>
                <div className="absolute bottom-4 left-6">
                  <p className="text-sm text-white/70 tracking-wider capitalize">{product.type?.toLowerCase().replace('_', ' ')}</p>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">{product.name}</h1>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-light">
                {[
                  { label: 'Quantity', value: `${stock} ${product.unit_of_measure || 'Units'}`, icon: Package },
                  { label: 'Price', value: `₹${price.toLocaleString('en-IN')}/${product.unit_of_measure ? (product.unit_of_measure.toLowerCase().startsWith('q') ? 'q' : product.unit_of_measure.toLowerCase()) : 'unit'}`, icon: TrendingUp },
                  { label: 'Grade', value: product.average_rating >= 4.5 ? 'A+' : product.average_rating >= 4.0 ? 'A' : 'B', icon: CheckCircle2 },
                  { label: 'Harvest', value: formatHarvestDate(product.harvest_date), icon: Calendar },
                ].map((item, i) => (
                  <div key={i} className="p-4 text-center">
                    <item.icon className="w-5 h-5 text-terracotta mx-auto mb-1" />
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="font-heading text-lg font-bold text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'details' as const, label: 'Farm Details' },
                { key: 'quality' as const, label: 'Quality Data' },
                { key: 'farmer' as const, label: 'Farmer Profile' },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${activeTab === tab.key ? 'bg-terracotta text-white shadow-md border-terracotta' : 'bg-white text-dark hover:bg-light shadow-xs border-border'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-border p-6 animate-fade-in">
              {activeTab === 'details' && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-black mb-4">Farm & Crop Details</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Variety / Product Name', value: product.name },
                      { label: 'Farming Method', value: product.farming_method || 'Traditional' },
                      { label: 'Irrigation Source', value: 'Tubewell + Canal' },
                      { label: 'Expected/Harvest Date', value: product.harvest_date ? new Date(product.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Ready for dispatch' },
                      { label: 'Shelf Life', value: product.shelf_life_days ? `${product.shelf_life_days} Days` : 'N/A' },
                      { label: 'Description', value: product.description || 'Verified high quality yield harvested under expert supervision.' },
                    ].map((item, i) => (
                      <div key={i} className="bg-offwhite rounded-xl p-4 border border-light">
                        <p className="text-xs text-muted mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-black break-words">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <h4 className="font-heading text-base font-semibold text-black mt-8 mb-4 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-terracotta" /> Pest History
                  </h4>
                  <div className="space-y-3">
                    {[
                      { pest: 'Armyworm', date: 'Jan 15, 2025', action: 'Biopesticide applied', resolved: true },
                      { pest: 'Aphids', date: 'Feb 5, 2025', action: 'Neem oil spray', resolved: true },
                    ].map((pest, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-offwhite rounded-xl border border-light">
                        <div>
                          <p className="text-sm font-semibold text-black">{pest.pest}</p>
                          <p className="text-xs text-muted">{pest.date} · {pest.action}</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sage/10 text-sage">
                          ✓ Resolved
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'quality' && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-sage" /> Soil Health History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-sage/10">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-dark uppercase">Parameter</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-dark uppercase">Value</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-dark uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-light">
                        {[
                          { param: 'pH Level', value: '6.8', status: 'Optimal' },
                          { param: 'Nitrogen', value: '280 kg/ha', status: 'Good' },
                          { param: 'Phosphorus', value: '22 kg/ha', status: 'Low' },
                          { param: 'Potassium', value: '185 kg/ha', status: 'Optimal' },
                          { param: 'Moisture', value: '42%', status: 'Good' },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-sm font-medium text-black">{row.param}</td>
                            <td className="px-4 py-3 text-sm text-dark">{row.value}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${row.status === 'Optimal' ? 'bg-sage/10 text-sage' : row.status === 'Good' ? 'bg-info/10 text-info' : 'bg-terracotta/10 text-terracotta'}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-heading text-base font-semibold text-black mt-8 mb-4">Quality Parameters</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Moisture', value: '11.5%', icon: Droplets, status: 'Pass' },
                      { label: 'Grade', value: 'A', icon: CheckCircle2, status: 'Grade A' },
                      { label: 'Foreign Matter', value: '0.2%', icon: Leaf, status: 'Pass' },
                    ].map((q, i) => (
                      <div key={i} className="bg-sage/5 border border-sage/20 rounded-xl p-4 text-center">
                        <q.icon className="w-6 h-6 text-sage mx-auto mb-2" />
                        <p className="text-xs text-muted">{q.label}</p>
                        <p className="font-heading text-xl font-bold text-black">{q.value}</p>
                        <p className="text-xs text-sage font-medium mt-1">{q.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'farmer' && (
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-sage/10 rounded-2xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-sage" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-black">Verified Farmer #{product.seller_id}</h3>
                      <p className="text-muted text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Punjab, India
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-amber fill-amber" />
                          <span className="font-semibold text-black">{product.average_rating ? product.average_rating.toFixed(1) : '4.5'}</span>
                        </span>
                        <span className="text-muted text-sm">({product.review_count || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'On-Time Delivery', value: '96%' },
                      { label: 'Quality Match', value: '94%' },
                      { label: 'Farmer ID', value: `#${product.seller_id}` },
                      { label: 'Response Time', value: '< 2 hrs' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-offwhite rounded-xl p-4 text-center border border-light">
                        <p className="text-xs text-muted">{stat.label}</p>
                        <p className="font-heading text-xl font-bold text-black mt-1">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-sage/5 border border-sage/20 rounded-xl p-4 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-sage shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-black">Verified Seller Partner</p>
                      <p className="text-xs text-dark">KYC verified · Active member of KisanMitra cooperative platform</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Review Section */}
            <ReviewSection productId={Number(id) || 1} />
          </div>

          {/* Right — Actions */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted">Total Value</p>
                    <p className="font-heading text-3xl font-bold text-black">₹{totalValue.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-dark">{stock} {product.unit_of_measure || 'Units'} × ₹{price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-amber/10 text-amber text-sm font-semibold rounded-full">
                    <Star className="w-4 h-4 fill-amber" /> {product.average_rating ? product.average_rating.toFixed(1) : '4.5'}
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  {[
                    { label: 'Price per unit', value: `₹${price.toLocaleString('en-IN')} / ${product.unit_of_measure || 'unit'}` },
                    { label: 'Quantity Available', value: `${stock} ${product.unit_of_measure || 'Units'}` },
                    { label: 'Est. Logistics & Transport', value: `₹${estTransport.toLocaleString('en-IN')}` },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted">{row.label}</span>
                      <span className="font-semibold text-black">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-black text-sm">Net Total</span>
                    <span className="font-heading text-xl font-bold text-sage">₹{netTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {offerSubmitted ? (
                  <div className="bg-sage/10 border border-sage/20 rounded-xl p-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-sage mx-auto mb-3" />
                    <p className="font-heading text-lg font-semibold text-black">Offer Submitted!</p>
                    <p className="text-sm text-dark mt-1">Sent offer of ₹{parseFloat(offerPrice).toLocaleString('en-IN')} / {product.unit_of_measure || 'unit'}. The farmer will respond within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setOfferSubmitted(true)} className="w-full py-4 bg-terracotta text-white font-heading font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md text-base mb-3 text-center">
                      Buy Now — ₹{totalValue.toLocaleString('en-IN')}
                    </button>
                    {!showOffer ? (
                      <button onClick={() => setShowOffer(true)} className="w-full py-4 border-2 border-terracotta text-terracotta font-heading font-semibold rounded-xl hover:bg-terracotta/5 transition-all text-base text-center">
                        Make an Offer
                      </button>
                    ) : (
                      <div className="border-2 border-terracotta/30 rounded-xl p-4 animate-fade-in">
                        <p className="text-sm font-semibold text-black mb-2">Your Offer (₹/{product.unit_of_measure || 'unit'})</p>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark font-semibold">₹</span>
                            <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="w-full pl-8 pr-4 py-3 bg-offwhite rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-terracotta/20 border border-border" />
                          </div>
                          <button onClick={() => setOfferSubmitted(true)} className="px-6 py-3 bg-terracotta text-white font-semibold rounded-lg hover:bg-terracotta-dark transition-colors">
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Trust */}
              <div className="bg-white rounded-2xl shadow-xs border border-border p-6">
                <h4 className="font-heading text-base font-semibold text-black mb-4">Trust & Security</h4>
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: 'Escrow-protected payment', desc: 'Funds held until quality verified' },
                    { icon: CreditCard, text: 'Instant UPI payout', desc: 'Farmer paid within 5 minutes' },
                    { icon: Truck, text: 'Logistics support', desc: 'Pickup scheduling & tracking' },
                    { icon: MessageSquare, text: 'Dispute resolution', desc: '24-hour mediation guarantee' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-offwhite rounded-xl border border-light">
                      <badge.icon className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black">{badge.text}</p>
                        <p className="text-xs text-muted">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl shadow-xs border border-border p-6">
                <h4 className="font-heading text-base font-semibold text-black mb-4">Need Help?</h4>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-terracotta text-white rounded-xl font-semibold text-sm hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                  <button className="flex-1 py-3 bg-offwhite text-dark rounded-xl font-semibold text-sm hover:bg-light transition-colors flex items-center justify-center gap-2 border border-border">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button className="flex-1 py-3 bg-offwhite text-dark rounded-xl font-semibold text-sm hover:bg-light transition-colors flex items-center justify-center gap-2 border border-border">
                    <Download className="w-4 h-4" /> Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
