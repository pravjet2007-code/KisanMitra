import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store, Package, ShoppingCart, TrendingUp, Settings,
  MapPin, ChevronRight, BarChart3, Clock, DollarSign,
  Plus, Edit, Trash2, Loader2, Search, Bell, Upload,
  CheckCircle2, X, Star, FileText, AlertTriangle, Shield,
  UploadCloud, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { productsApi, ordersApi, ApiProduct, ApiOrder, OrderStatus } from '../utils/api';

type Tab = 'overview' | 'inventory' | 'orders' | 'analytics' | 'profile';

interface SalesDataPoint {
  month: string;
  sales: number;
  orders: number;
}

export default function SellerDashboard() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Business Onboarding State
  const [businessName, setBusinessName] = useState(user?.business_name || '');
  const [businessType, setBusinessType] = useState(user?.business_type || '');
  const [location, setLocation] = useState(user?.location || '');
  const [cropPrefs, setCropPrefs] = useState(user?.crop_type || ''); // Acts as product preference
  const profileSetup = !!(user?.full_name && user?.business_name);

  // Sync state with auth user context
  useEffect(() => {
    if (user?.business_name) setBusinessName(user.business_name);
    if (user?.business_type) setBusinessType(user.business_type);
    if (user?.location) setLocation(user.location);
    if (user?.crop_type) setCropPrefs(user.crop_type);
  }, [user]);

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API States
  const [sellerProducts, setSellerProducts] = useState<ApiProduct[]>([]);
  const [sellerOrders, setSellerOrders] = useState<ApiOrder[]>([]);
  const [dbCategories, setDbCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modals & Forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);

  // Form Fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<number | ''>('');
  const [prodType, setProdType] = useState<'INPUT' | 'PRODUCE'>('INPUT');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodUnit, setProdUnit] = useState('kg');
  const [prodStock, setProdStock] = useState('');
  const [prodShelfLife, setProdShelfLife] = useState('');
  const [prodFarmingMethod, setProdFarmingMethod] = useState('Conventional');
  const [prodImageUrl, setProdImageUrl] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products & orders for this seller
  const fetchDashboardData = async () => {
    if (!user?.user_id) return;
    setLoadingData(true);
    try {
      const cats = await productsApi.getCategories();
      setDbCategories(cats);

      const prodRes = await productsApi.list({ limit: 100 });
      const myProds = prodRes.items.filter((p) => p.seller_id === user.user_id);
      setSellerProducts(myProds);

      const myOrders = await ordersApi.listBySeller(user.user_id);
      setSellerOrders(myOrders);
    } catch (err) {
      console.error('Failed to fetch seller dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id, activeTab]);

  const resetForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('');
    setProdType('INPUT');
    setProdDescription('');
    setProdPrice('');
    setProdUnit('kg');
    setProdStock('');
    setProdShelfLife('');
    setProdFarmingMethod('Conventional');
    setProdImageUrl('');
  };

  const populateForm = (p: ApiProduct) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category_id || '');
    setProdType(p.type === 'INPUT' || p.type === 'PRODUCE' ? p.type : 'INPUT');
    setProdDescription(p.description || '');
    setProdPrice(String(parseFloat(p.price_per_unit) || ''));
    setProdUnit(p.unit_of_measure || 'kg');
    setProdStock(String(parseFloat(p.stock_quantity) || ''));
    setProdShelfLife(p.shelf_life_days ? String(p.shelf_life_days) : '');
    setProdFarmingMethod(p.farming_method || 'Conventional');
    setProdImageUrl(p.image_url || '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const imageUrl = await productsApi.processImage(file);
      setProdImageUrl(imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmittingProduct(true);
    try {
      const payload = {
        name: prodName,
        category_id: prodCategory ? Number(prodCategory) : 1,
        type: prodType,
        description: prodDescription,
        price_per_unit: Number(prodPrice),
        unit_of_measure: prodUnit,
        stock_quantity: Number(prodStock),
        shelf_life_days: prodShelfLife ? Number(prodShelfLife) : undefined,
        farming_method: prodFarmingMethod,
        image_url: prodImageUrl || undefined,
        seller_id: user?.user_id || 0,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.product_id, payload);
      } else {
        await productsApi.create(payload);
      }

      setShowProductModal(false);
      fetchDashboardData();
      resetForm();
    } catch (err) {
      console.error('Product save failed:', err);
      alert('Failed to save listing. Please verify inputs.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await productsApi.delete(productId);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete listing.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update status.');
    }
  };

  const handleProfileSave = async () => {
    if (!businessName || !location) return;
    try {
      await updateProfile({
        business_name: businessName,
        business_type: businessType,
        location,
        crop_type: cropPrefs,
      });
      setActiveTab('overview');
    } catch (err) {
      console.error('Profile save failed:', err);
    }
  };

  // Compute stats
  const totalRevenue = sellerOrders
    .filter((o) => o.current_status === 'DELIVERED')
    .reduce((sum, order) => {
      const myItems = order.items.filter(item => 
        sellerProducts.some(p => p.product_id === item.product_id)
      );
      const myOrderTotal = myItems.reduce(
        (s, item) => s + parseFloat(item.price_at_purchase) * parseFloat(item.quantity),
        0
      );
      return sum + myOrderTotal;
    }, 0);

  const pendingOrdersCount = sellerOrders.filter(
    (o) => o.current_status !== 'DELIVERED' && o.current_status !== 'CANCELLED'
  ).length;

  const lowStockProducts = sellerProducts.filter(
    (p) => parseFloat(p.stock_quantity) < 50
  );

  // Filter listings by search query
  const filteredProducts = sellerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock Sales Trend Data for the chart
  const salesHistory: SalesDataPoint[] = [
    { month: 'Jan', sales: 12000, orders: 15 },
    { month: 'Feb', sales: 19000, orders: 24 },
    { month: 'Mar', sales: 32000, orders: 42 },
    { month: 'Apr', sales: 27000, orders: 36 },
    { month: 'May', sales: 45000, orders: 58 },
  ];

  // Helper for status badge styling
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber/10 text-amber border-amber/20';
      case 'CONFIRMED':
        return 'bg-sage/20 text-sage-dark border-sage/35';
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'SHIPPED':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'OUT_FOR_DELIVERY':
        return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default:
        return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: t('sd.tabs.overview', 'Overview'), icon: Store },
    { key: 'inventory', label: t('sd.tabs.inventory', 'Manage Inventory'), icon: Package },
    { key: 'orders', label: t('sd.tabs.orders', 'Orders'), icon: ShoppingCart },
    { key: 'analytics', label: t('sd.tabs.analytics', 'Sales Analytics'), icon: TrendingUp },
    { key: 'profile', label: t('sd.tabs.profile', 'Business Profile'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-black">
                {profileSetup
                  ? t('sd.overview.welcomeTitle', 'Namaste, {{name}}! 🙏', { name: user?.full_name })
                  : t('sd.title', 'Seller Dashboard')}
              </h1>
              {user?.is_verified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber/10 text-amber text-xs font-semibold rounded-full border border-amber/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Shop
                </span>
              )}
            </div>
            <p className="text-medium text-sm flex items-center gap-2">
              {profileSetup ? (
                <>
                  <MapPin className="w-4 h-4 text-amber" />
                  {location} {businessType ? ` · ${businessType}` : ''}
                </>
              ) : (
                t('sd.overview.welcomeSubtitle', 'Complete your seller onboarding to start listing products')
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-white rounded-xl shadow-xs hover:shadow-sm transition-all border border-border">
              <Bell className="w-5 h-5 text-dark" />
            </button>
            <button
              onClick={() => { resetForm(); setShowProductModal(true); }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-white rounded-xl font-semibold hover:bg-amber-light transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> {t('sd.inventory.addInput', 'List New Item')}
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                activeTab === tab.key
                  ? 'bg-amber text-white shadow-md border-amber'
                  : 'bg-white text-dark hover:bg-light shadow-xs border-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* PROFILE/ONBOARDING TAB */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber/20 animate-pulse-slow">
                  <Store className="w-10 h-10 text-amber" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-black">{t('sd.setup.title', 'Seller Onboarding')}</h2>
                <p className="text-medium text-sm mt-1">{t('sd.setup.subtitle', 'Complete verification to unlock sales and inventory tools')}</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('sd.setup.name', 'Business / Shop Name *')}</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Bharat Agri Inputs"
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('sd.setup.type', 'Seller Type')}</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none appearance-none"
                  >
                    <option value="">{t('sd.setup.selectType', 'Select type')}</option>
                    <option value="Input Dealer">Seed & Fertilizer Dealer</option>
                    <option value="FPO">Farmer Producer Organization (FPO)</option>
                    <option value="Trader">Agricultural Trader</option>
                    <option value="Wholesaler">Wholesale Merchant</option>
                    <option value="Cooperative">Cooperative Society</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('sd.setup.location', 'Location (City, State) *')}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bathinda, Punjab"
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('sd.setup.license', 'License Number (Seed/Fertilizer/GSTIN)')}</label>
                  <input
                    type="text"
                    value={cropPrefs}
                    onChange={(e) => setCropPrefs(e.target.value)}
                    placeholder="e.g. GSTIN34AAACB1234F1Z0"
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('sd.setup.documents', 'Upload Certificates')}</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-amber hover:bg-amber/5 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-medium">{t('sd.setup.uploadDst', 'Click to upload registration PDF / Image')}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.lang', 'Preferred Language')}</label>
                  <select
                    value={i18n.language.split('-')[0]}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none appearance-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="pa">ਪੰਜਾਬੀ</option>
                    <option value="mr">मराठी</option>
                    <option value="gu">ગુજરાતી</option>
                    <option value="ta">தமிழ்</option>
                    <option value="te">తెలుగు</option>
                    <option value="bn">বাংলা</option>
                  </select>
                </div>
                <button
                  onClick={handleProfileSave}
                  disabled={!businessName || !location}
                  className="w-full py-4 bg-amber hover:bg-amber-light text-white font-heading font-bold rounded-xl transition-all shadow-md text-base disabled:opacity-50"
                >
                  {t('sd.setup.submit', 'Save Profile')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {!profileSetup && (
              <div className="bg-gradient-to-r from-amber/10 to-clay/10 border-2 border-dashed border-amber/30 rounded-2xl p-6 md:p-8 text-center">
                <Store className="w-12 h-12 text-amber mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-black mb-2">Welcome to the KISAN MITRA Seller Portal!</h3>
                <p className="text-medium text-sm mb-4 max-w-md mx-auto">{t('sd.overview.welcomeSubtitle', 'Complete your seller onboarding to start listing products')}</p>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-6 py-3 bg-amber hover:bg-amber-light text-white rounded-xl font-semibold transition-colors shadow-md"
                >
                  {t('sd.overview.setupBtn', 'Complete Shop Profile')}
                </button>
              </div>
            )}

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t('sd.stats.revenue', 'Total Revenue'), value: profileSetup ? `₹${totalRevenue}` : '₹0', icon: DollarSign, bg: 'bg-emerald-500/10', color: 'text-emerald-600' },
                { label: t('sd.stats.listings', 'Active Listings'), value: sellerProducts.length.toString(), icon: Package, bg: 'bg-amber/10', color: 'text-amber' },
                { label: t('sd.stats.pending', 'Pending Orders'), value: pendingOrdersCount.toString(), icon: ShoppingCart, bg: 'bg-terracotta/10', color: 'text-terracotta' },
                { label: t('sd.stats.rating', 'Seller Rating'), value: '4.8 ★', icon: Star, bg: 'bg-blue-500/10', color: 'text-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-xs border border-border hover:shadow-sm transition-all group">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="font-heading text-2xl font-bold text-black">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* SVG Interactive Chart & Low Stock Alerts */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Custom SVG Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-border flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-black mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber" /> Sales Trend
                  </h3>
                  <p className="text-xs text-muted mb-4">Monthly revenue performance for agricultural input products</p>
                </div>

                {/* SVG Visual bar representation */}
                <div className="h-48 w-full flex items-end justify-between px-2 pt-6 border-b border-border/60">
                  {salesHistory.map((pt, index) => {
                    const maxSales = Math.max(...salesHistory.map(s => s.sales));
                    const heightPercent = maxSales > 0 ? (pt.sales / maxSales) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold">
                          ₹{pt.sales} ({pt.orders} orders)
                        </div>
                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-10 sm:w-14 bg-gradient-to-t from-amber to-amber-light rounded-t-lg transition-all duration-500 group-hover:from-amber-light group-hover:to-amber shadow-xs"
                        />
                        {/* Label */}
                        <span className="text-[10px] text-muted font-bold mt-2 uppercase">{pt.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Low Stock Warning List */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-terracotta" /> {t('sd.overview.lowStock', 'Low Stock Alerts')}
                </h3>
                {lowStockProducts.length === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                    <p className="text-muted text-xs leading-relaxed">{t('sd.overview.noAlerts', 'All products are well stocked.')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    {lowStockProducts.map((p) => (
                      <div key={p.product_id} className="flex items-center justify-between p-3 bg-offwhite border border-border/70 rounded-xl">
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-xs text-black truncate">{p.name}</p>
                          <p className="text-[10px] text-red-500 font-bold">Only {parseFloat(p.stock_quantity)} {p.unit_of_measure} left</p>
                        </div>
                        <button
                          onClick={() => { populateForm(p); setShowProductModal(true); }}
                          className="px-2.5 py-1 bg-white border border-border text-[10px] font-bold rounded-lg hover:border-amber hover:text-amber transition-colors"
                        >
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                  <Clock className="w-5 h-5 text-terracotta" /> {t('sd.overview.recentOrders', 'Recent Incoming Orders')}
                </h3>
                <button onClick={() => setActiveTab('orders')} className="text-amber text-xs font-semibold hover:underline flex items-center gap-0.5">
                  View All Orders <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                  <ShoppingCart className="w-10 h-10 text-muted mx-auto mb-2" />
                  <p className="text-muted text-sm">{t('sd.overview.noOrders', 'No orders received yet.')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sellerOrders.slice(0, 3).map((order) => {
                    const myItems = order.items.filter(item =>
                      sellerProducts.some(p => p.product_id === item.product_id)
                    );
                    const myTotal = myItems.reduce(
                      (sum, item) => sum + parseFloat(item.price_at_purchase) * parseFloat(item.quantity),
                      0
                    );
                    return (
                      <div key={order.order_id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-offwhite border border-border rounded-xl gap-2">
                        <div>
                          <p className="text-xs font-bold text-black">Order ID: #{order.order_id}</p>
                          <p className="text-[10px] text-muted">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusStyle(order.current_status)}`}>
                            {order.current_status}
                          </span>
                          <span className="font-heading font-bold text-sm text-black">₹{myTotal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl p-5 border border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder={t('sd.inventory.search', 'Search inventory...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-offwhite border border-border rounded-xl text-xs focus:border-amber outline-none transition-all"
                />
              </div>
              <button
                onClick={() => { resetForm(); setShowProductModal(true); }}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber hover:bg-amber-light text-white text-xs font-bold rounded-xl shadow-md hover:shadow flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Inventory Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl bg-white">
                <Package className="w-16 h-16 text-muted mx-auto mb-4 animate-pulse-slow" />
                <h4 className="font-heading text-lg font-bold text-black mb-1">{t('sd.inventory.none', 'No products listed yet')}</h4>
                <p className="text-muted text-sm mb-6 max-w-sm mx-auto">{t('sd.inventory.desc', 'Start listing farming inputs to reach local farmers.')}</p>
                <button
                  onClick={() => { resetForm(); setShowProductModal(true); }}
                  className="px-6 py-3 bg-amber hover:bg-amber-light text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {t('sd.inventory.addFirst', 'Add Your First Product')}
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <div key={prod.product_id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Product Image */}
                      <div className="h-44 bg-light relative overflow-hidden flex items-center justify-center">
                        {prod.image_url ? (
                          <img
                            src={prod.image_url.startsWith('http') ? prod.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${prod.image_url}`}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted bg-amber/5 gap-2">
                            <Store className="w-10 h-10 text-amber/35" />
                            <span className="text-[10px] font-bold text-amber/60 uppercase">Agricultural Input</span>
                          </div>
                        )}
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white border border-border shadow-xs uppercase tracking-wide text-dark">
                          {prod.farming_method || 'Conventional'}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-2 text-left">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-amber bg-amber/10 px-2 py-0.5 rounded">
                          {dbCategories.find(c => c.category_id === prod.category_id)?.name || 'Inputs'}
                        </span>
                        <h4 className="font-heading font-bold text-black text-base truncate">{prod.name}</h4>
                        <p className="text-medium text-xs line-clamp-2 min-h-[2rem] leading-relaxed">{prod.description || 'No description provided.'}</p>

                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
                          <div>
                            <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">Price</p>
                            <p className="font-heading font-bold text-amber text-sm">
                              ₹{parseFloat(prod.price_per_unit)}{' '}
                              <span className="text-[10px] text-muted font-normal">/ {prod.unit_of_measure}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">Stock Available</p>
                            <p className={`font-heading font-bold text-sm ${parseFloat(prod.stock_quantity) < 50 ? 'text-red-500' : 'text-black'}`}>
                              {parseFloat(prod.stock_quantity)}{' '}
                              <span className="text-[10px] text-muted font-normal">{prod.unit_of_measure}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-offwhite border-t border-border flex justify-end gap-2">
                      <button
                        onClick={() => populateForm(prod)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-dark text-xs font-bold rounded-lg hover:border-amber/40 hover:text-amber transition-colors shadow-2xs"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.product_id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-bold text-black mb-1">{t('sd.orders.title', 'Order Fulfillment')}</h3>
              <p className="text-muted text-xs mb-6">Manage buyer orders, update delivery status, and track UPI escrow settlements.</p>

              {sellerOrders.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-border rounded-xl">
                  <Clock className="w-16 h-16 text-muted mx-auto mb-4 animate-pulse-slow" />
                  <h4 className="font-heading text-lg font-bold text-black mb-1">{t('sd.orders.none', 'No incoming orders')}</h4>
                  <p className="text-muted text-sm max-w-xs mx-auto">{t('sd.orders.desc', 'Farming input orders placed by local farmers will appear here instantly.')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerOrders.map((order) => {
                    const myItems = order.items.filter(item =>
                      sellerProducts.some(fp => fp.product_id === item.product_id)
                    );

                    if (myItems.length === 0) return null;

                    const myOrderTotal = myItems.reduce(
                      (sum, item) => sum + parseFloat(item.price_at_purchase) * parseFloat(item.quantity),
                      0
                    );

                    return (
                      <div key={order.order_id} className="bg-offwhite rounded-2xl p-5 border border-border flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border/50 pb-3">
                          <div>
                            <span className="text-[10px] font-bold text-muted tracking-wide uppercase">Order ID: #{order.order_id}</span>
                            <h4 className="font-heading font-bold text-black text-sm">Placed on: {new Date(order.created_at).toLocaleDateString()}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-medium">Delivery Status:</span>
                            <select
                              value={order.current_status}
                              onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value as OrderStatus)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold outline-none border focus:ring-1 focus:ring-amber/20 cursor-pointer shadow-xs transition-all ${getStatusStyle(order.current_status)}`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Order items lists */}
                        <div className="space-y-3">
                          {myItems.map((item, idx) => {
                            const p = sellerProducts.find(fp => fp.product_id === item.product_id);
                            return (
                              <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-border/40">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-amber/10 rounded-lg flex items-center justify-center text-amber font-bold text-xs border border-amber/10">
                                    {p?.name?.charAt(0) || 'I'}
                                  </div>
                                  <div>
                                    <h5 className="font-heading font-bold text-black text-sm">{p?.name || 'Input Product'}</h5>
                                    <p className="text-muted text-xs">
                                      Qty: {parseFloat(item.quantity)} {p?.unit_of_measure || 'bag'} @ ₹
                                      {parseFloat(item.price_at_purchase)}/{p?.unit_of_measure || 'bag'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-heading font-bold text-black text-sm">₹{parseFloat(item.price_at_purchase) * parseFloat(item.quantity)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-border/40">
                          <span className="text-[10px] text-muted font-semibold uppercase">Buyer ID: {order.buyer_id}</span>
                          <div className="text-right">
                            <span className="text-xs text-muted block">Escrow Earnings</span>
                            <span className="font-heading font-bold text-lg text-emerald-600">₹{myOrderTotal}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Main Charts area */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-bold text-black mb-1">{t('sd.analytics.title', 'Sales Performance')}</h3>
              <p className="text-muted text-xs mb-6">Aggregate metrics of your farm supply shop and feedback scoring.</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Growth rate', value: '+14.5%', sub: 'vs last season' },
                  { label: 'Order compliance', value: '98.2%', sub: '0 disputes' },
                  { label: 'Customer return rate', value: '42.0%', sub: 'High retention' },
                ].map((metric, i) => (
                  <div key={i} className="bg-offwhite rounded-xl p-5 border border-border text-center shadow-2xs">
                    <p className="text-xs text-muted font-bold uppercase tracking-wide">{metric.label}</p>
                    <p className="font-heading text-3xl font-bold text-black mt-2">{metric.value}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">{metric.sub}</p>
                  </div>
                ))}
              </div>

              {/* Feedbacks list */}
              <div>
                <h4 className="font-heading text-base font-bold text-black mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber" /> {t('sd.analytics.feedback', 'Recent Customer Reviews')}
                </h4>
                <div className="space-y-3">
                  {[
                    { author: 'Ram Singh (Farmer)', rating: 5, comment: 'Excellent quality wheat seeds, germination rate was above 95%. Highly recommended input dealer!', date: '2 days ago' },
                    { author: 'Gurpreet Singh (FPO Lead)', rating: 4, comment: 'Organic nitrogen fertilizers delivered on time. Looking forward to bulk wholesale orders next month.', date: '1 week ago' },
                  ].map((rev, i) => (
                    <div key={i} className="p-4 bg-offwhite border border-border/80 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-dark">{rev.author}</span>
                        <span className="text-[10px] text-muted">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'text-amber fill-amber' : 'text-muted'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-medium leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {(showProductModal || editingProduct) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-scale-in text-left">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-amber/10 to-amber-light/5 border-b border-border flex justify-between items-center">
              <div>
                <h4 className="font-heading text-lg md:text-xl font-bold text-black">
                  {editingProduct ? 'Edit Product Listing' : 'List New Agriculture Item'}
                </h4>
                <p className="text-xs text-muted mt-0.5 font-medium">Update prices, stock, and descriptions for farmer marketplace.</p>
              </div>
              <button
                onClick={() => { setShowProductModal(false); resetForm(); }}
                className="p-2 text-muted hover:text-dark rounded-full hover:bg-light transition-all outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Organic NPK Fertilizer"
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Listing Type *</label>
                  <div className="flex bg-offwhite p-1 rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setProdType('INPUT')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        prodType === 'INPUT' ? 'bg-white text-amber shadow-2xs' : 'text-muted hover:text-dark'
                      }`}
                    >
                      Farming Input
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdType('PRODUCE')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        prodType === 'PRODUCE' ? 'bg-white text-amber shadow-2xs' : 'text-muted hover:text-dark'
                      }`}
                    >
                      Bulk Produce
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Category *</label>
                  <select
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="farming-tools">Farming Tools</option>
                    <option value="fertilisers-pesticides">Fertilisers and Pesticides</option>
                    {dbCategories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Standard Grade / Variety</label>
                  <select
                    value={prodFarmingMethod}
                    onChange={(e) => setProdFarmingMethod(e.target.value)}
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none appearance-none"
                  >
                    <option value="Conventional">Conventional</option>
                    <option value="Organic">Organic Grade A</option>
                    <option value="Certified Seed">Certified Seed Breed</option>
                    <option value="Premium Quality">Premium Quality Input</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark mb-1.5">Description / Specifications</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Variety, composition, usage guidelines, safety rules..."
                  className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Stock Available *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-1.5">Unit of Measure *</label>
                  <select
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none appearance-none"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="bag">bag</option>
                    <option value="box">box</option>
                    <option value="piece">piece</option>
                    <option value="litre">litre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark mb-1.5">Shelf Life (Days)</label>
                <input
                  type="number"
                  value={prodShelfLife}
                  onChange={(e) => setProdShelfLife(e.target.value)}
                  placeholder="e.g. 365"
                  className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
                />
              </div>

              {/* Product Image upload */}
              <div>
                <label className="block text-xs font-bold text-dark mb-1.5">Product Image</label>
                {prodImageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-border h-48 bg-offwhite flex items-center justify-center group/img">
                    <img
                      src={prodImageUrl.startsWith('http') ? prodImageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${prodImageUrl}`}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProdImageUrl('')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs rounded-xl gap-2 outline-none"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" /> Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-6 bg-offwhite hover:bg-amber/5 hover:border-amber/40 transition-all cursor-pointer">
                    <div className="flex flex-col items-center text-center gap-1.5">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-8 h-8 text-amber animate-spin" />
                          <span className="text-xs font-medium text-dark mt-1">Uploading image...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-amber/60" />
                          <span className="text-xs font-medium text-dark">Click to upload product image</span>
                          <span className="text-[10px] text-muted">Supports JPG, PNG, WEBP</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setShowProductModal(false); resetForm(); }}
                  className="px-5 py-3 border border-border text-dark text-xs font-bold rounded-xl hover:bg-light transition-all outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct || uploadingImage}
                  className="px-6 py-3 bg-amber hover:bg-amber-light text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2 outline-none"
                >
                  {submittingProduct && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
