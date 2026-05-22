import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, Bug, TrendingUp, Bell,
  Sun, Plus,
  MapPin, ChevronRight, BarChart3,
  ShoppingCart, CreditCard,
  Mic, Settings, User, Upload, BookOpen, Camera, Sparkles,
  Search, ExternalLink, AlertCircle, CheckCircle2, X,
  Edit, Trash2, Loader2, Package, Clock, UploadCloud
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSoilAnalysis, getDiseaseAnalysis, getWeatherTasks, WeatherTaskDay, getSchemeEligibilityAnalysis } from '../utils/gemini';
import { schemesApi, Scheme, productsApi, ordersApi, ApiProduct, ApiOrder, OrderStatus } from '../utils/api';
import { useAuth } from '../context/AuthContext';

type Tab = 'overview' | 'soil' | 'pest' | 'disease' | 'schemes' | 'market' | 'transactions' | 'profile';

export default function FarmerDashboard() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showVoice, setShowVoice] = useState(false);

  // Profile state — pre-populated from AuthContext user
  const [farmerName, setFarmerName] = useState(user?.full_name || '');
  const [farmLocation, setFarmLocation] = useState(user?.location || '');
  const [farmSize, setFarmSize] = useState(user?.farm_size || '');
  const [cropType, setCropType] = useState(user?.crop_type || '');
  const profileSetup = !!(user?.full_name);

  // Re-sync local profile fields whenever user context updates (e.g. after async profile fetch)
  useEffect(() => {
    if (user?.full_name) setFarmerName(user.full_name);
    if (user?.location)  setFarmLocation(user.location);
    if (user?.farm_size) setFarmSize(user.farm_size);
    if (user?.crop_type) setCropType(user.crop_type);
  }, [user]);

  // On mount: always fetch the latest profile from the DB
  useEffect(() => {
    refreshProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ML States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<{ disease_name: string; confidence: number } | null>(null);

  // Weather States
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Soil states
  const [soilData, setSoilData] = useState({ ph: '', n: '', p: '', k: '' });
  const [soilAnalysis, setSoilAnalysis] = useState('');
  const [isSoilAnalyzing, setIsSoilAnalyzing] = useState(false);

  // Disease GenAI states
  const [diseaseAnalysis, setDiseaseAnalysis] = useState('');
  const [isDiseaseAnalysing, setIsDiseaseAnalysing] = useState(false);

  // Weather Task List state
  const [weatherTasks, setWeatherTasks] = useState<WeatherTaskDay[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState(false);

  // Schemes states
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [schemesSearch, setSchemesSearch] = useState('');
  const [selectedSchemeCategory, setSelectedSchemeCategory] = useState('All');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<Scheme | null>(null);
  const [eligibilityAnalysis, setEligibilityAnalysis] = useState('');
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  // Marketplace CRUD & Orders states
  const [farmerProducts, setFarmerProducts] = useState<ApiProduct[]>([]);
  const [farmerOrders, setFarmerOrders] = useState<ApiOrder[]>([]);
  const [dbCategories, setDbCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);

  // Form states
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<number | ''>('');
  const [prodType, setProdType] = useState<'PRODUCE' | 'INPUT'>('PRODUCE');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodUnit, setProdUnit] = useState('kg');
  const [prodStock, setProdStock] = useState('');
  const [prodHarvestDate, setProdHarvestDate] = useState('');
  const [prodShelfLife, setProdShelfLife] = useState('');
  const [prodFarmingMethod, setProdFarmingMethod] = useState('Organic');
  const [prodImageUrl, setProdImageUrl] = useState('');

  const resetForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('');
    setProdType('PRODUCE');
    setProdDescription('');
    setProdPrice('');
    setProdUnit('kg');
    setProdStock('');
    setProdHarvestDate('');
    setProdShelfLife('');
    setProdFarmingMethod('Organic');
    setProdImageUrl('');
  };

  const populateForm = (p: ApiProduct) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category_id || '');
    setProdType(p.type === 'PRODUCE' || p.type === 'INPUT' ? p.type : 'PRODUCE');
    setProdDescription(p.description || '');
    setProdPrice(String(parseFloat(p.price_per_unit) || ''));
    setProdUnit(p.unit_of_measure || 'kg');
    setProdStock(String(parseFloat(p.stock_quantity) || ''));
    setProdHarvestDate(p.harvest_date || '');
    setProdShelfLife(p.shelf_life_days ? String(p.shelf_life_days) : '');
    setProdFarmingMethod(p.farming_method || 'Organic');
    setProdImageUrl(p.image_url || '');
  };

  const fetchMarketData = async () => {
    if (!user?.user_id) return;
    setLoadingMarket(true);
    try {
      const cats = await productsApi.getCategories();
      setDbCategories(cats);

      const prodRes = await productsApi.list({ limit: 100 });
      const myProds = prodRes.items.filter((p) => p.seller_id === user.user_id);
      setFarmerProducts(myProds);

      const myOrders = await ordersApi.listBySeller(user.user_id);
      setFarmerOrders(myOrders);
    } catch (err) {
      console.error('Failed to fetch marketplace data:', err);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchMarketData();
    }
  }, [activeTab, user?.user_id]);

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        harvest_date: prodHarvestDate || undefined,
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
      fetchMarketData();
      resetForm();
    } catch (err) {
      console.error('Product save failed:', err);
      alert('Failed to save listing. Please verify inputs.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this crop listing?')) return;
    try {
      await productsApi.delete(productId);
      fetchMarketData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete listing.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      fetchMarketData();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update status.');
    }
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      setSchemesLoading(true);
      try {
        const data = await schemesApi.list();
        setSchemes(data);
      } catch (err) {
        console.error("Error fetching schemes:", err);
      } finally {
        setSchemesLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const handleCheckEligibility = async (scheme: Scheme) => {
    setSelectedSchemeForModal(scheme);
    setEligibilityAnalysis('');
    if (!profileSetup) return;
    
    setEligibilityLoading(true);
    try {
      const userProfile = {
        name: farmerName,
        location: farmLocation,
        farmSize: farmSize,
        cropType: cropType
      };
      const analysis = await getSchemeEligibilityAnalysis(scheme.name, scheme.description, userProfile, i18n.language);
      setEligibilityAnalysis(analysis);
    } catch (err) {
      console.error("AI eligibility check failed:", err);
      setEligibilityAnalysis("Could not compile AI analysis. Please click the button below to apply via the official government portal.");
    } finally {
      setEligibilityLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(schemesSearch.toLowerCase()) || 
                          scheme.description.toLowerCase().includes(schemesSearch.toLowerCase()) ||
                          scheme.category.toLowerCase().includes(schemesSearch.toLowerCase());
    
    const matchesCategory = selectedSchemeCategory === 'All' || 
                            scheme.category.toLowerCase() === selectedSchemeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setWeatherLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
          const data = await res.json();
          setWeatherData(data);
          // Store weather data — tasks generated when user clicks or saves profile
        } catch (err) {
          console.error('Weather fetch error:', err);
        } finally {
          setWeatherLoading(false);
        }
      },
      (err) => {
        setLocationError(err.message);
        setWeatherLoading(false);
      }
    );
  }, []);

  // Compute farmer specific stats and transactions
  const farmerConfirmedOrders = farmerOrders.filter(
    (o) => o.current_status !== 'PENDING' && o.current_status !== 'CANCELLED'
  );

  const totalFarmerEarnings = farmerConfirmedOrders.reduce((sum, order) => {
    const myItems = order.items.filter(item => 
      farmerProducts.some(p => p.product_id === item.product_id)
    );
    return sum + myItems.reduce((s, item) => s + (parseFloat(item.price_at_purchase) || 0) * (parseFloat(item.quantity) || 0), 0);
  }, 0);

  const completedFarmerOrdersCount = farmerOrders.filter(
    (o) => o.current_status === 'DELIVERED'
  ).length;

  const pendingFarmerOrdersCount = farmerOrders.filter(
    (o) => o.current_status !== 'DELIVERED' && o.current_status !== 'CANCELLED' && o.current_status !== 'PENDING'
  ).length;

  const farmerTransactions = farmerOrders
    .filter(o => o.current_status !== 'PENDING' && o.current_status !== 'CANCELLED')
    .map(order => {
      const myItems = order.items.filter(item => 
        farmerProducts.some(p => p.product_id === item.product_id)
      );
      const itemsSummary = myItems.map(item => {
        const prod = farmerProducts.find(p => p.product_id === item.product_id);
        return `${prod?.name || 'Crop'} (${parseFloat(item.quantity)} ${prod?.unit_of_measure || 'kg'})`;
      }).join(', ');

      const totalEarned = myItems.reduce(
        (sum, item) => sum + (parseFloat(item.price_at_purchase) || 0) * (parseFloat(item.quantity) || 0),
        0
      );

      return {
        orderId: order.order_id,
        date: new Date(order.created_at).toLocaleDateString(),
        itemsSummary,
        buyerId: order.buyer_id,
        amount: totalEarned,
        status: order.current_status,
      };
    })
    .filter(txn => txn.amount > 0);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: t('farmerDash.tabs.overview', 'Overview'), icon: BarChart3 },
    { key: 'soil', label: t('farmerDash.tabs.soil', 'Soil Health'), icon: Leaf },
    { key: 'pest', label: t('farmerDash.tabs.pest', 'Pest Monitor'), icon: Bug },
    { key: 'disease', label: t('farmerDash.tabs.disease', 'Disease Scanner'), icon: Camera },
    { key: 'schemes', label: t('farmerDash.tabs.schemes', 'Gov Schemes'), icon: BookOpen},
    { key: 'market', label: t('farmerDash.tabs.market', 'Marketplace'), icon: ShoppingCart },
    { key: 'transactions', label: t('farmerDash.tabs.transactions', 'Transactions'), icon: CreditCard },
    { key: 'profile', label: t('farmerDash.tabs.profile', 'Profile'), icon: Settings },
  ];

  const buildForecast = (data: any) => {
    if (!data?.daily) return [];
    return data.daily.time.slice(0, 3).map((time: string, i: number) => {
      const date = new Date(time);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en', { weekday: 'short' });
      const code = data.daily.weathercode[i];
      const condition = code > 60 ? 'rainy' : code > 2 ? 'cloudy' : 'sunny';
      return {
        date: dayName,
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        rainProb: data.daily.precipitation_probability_max[i] ?? 0,
        condition,
      };
    });
  };

  const handleGenerateTasks = async (data?: any) => {
    const src = data || weatherData;
    if (!src || !cropType) return;
    setIsLoadingTasks(true);
    setTasksError(false);
    setWeatherTasks([]);
    try {
      const forecast = buildForecast(src);
      const result = await getWeatherTasks(forecast, cropType, i18n.language);
      if (result.length > 0) setWeatherTasks(result);
      else setTasksError(true);
    } catch {
      setTasksError(true);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleProfileSave = async () => {
    if (farmerName && farmLocation) {
      await updateProfile({
        full_name: farmerName,
        location: farmLocation,
        farm_size: farmSize,
        crop_type: cropType,
      });
      setActiveTab('overview');
      // Auto-generate tasks now that we have cropType
      if (weatherData && cropType) handleGenerateTasks(weatherData);
      else if (weatherData) setTimeout(() => handleGenerateTasks(weatherData), 200);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null); // Reset previous prediction
    setDiseaseAnalysis(''); // Reset AI analysis
  };

  const uploadAndPredict = async () => {
    if (!selectedFile) return;

    setIsPredicting(true);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Prediction API failed');

      const data = await response.json();
      if (data.success) {
        setPrediction({
          disease_name: data.disease_name,
          confidence: data.confidence,
        });
      }
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Analysis failed. Make sure the backend server is running.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleDiseaseAnalysis = async () => {
    if (!prediction) return;
    setIsDiseaseAnalysing(true);
    setDiseaseAnalysis('');
    try {
      const result = await getDiseaseAnalysis(prediction.disease_name, cropType, i18n.language);
      setDiseaseAnalysis(result);
    } catch (error) {
      console.error("Disease analysis error:", error);
    } finally {
      setIsDiseaseAnalysing(false);
    }
  };

  const handleSoilAnalysis = async () => {
    if (!soilData.ph || !soilData.n || !soilData.p || !soilData.k) {
      alert("Please fill all soil parameters");
      return;
    }
    setIsSoilAnalyzing(true);
    setSoilAnalysis('');
    try {
      const result = await getSoilAnalysis(soilData, cropType, i18n.language);
      setSoilAnalysis(result);
    } catch (error) {
      console.error("Soil analysis error:", error);
    } finally {
      setIsSoilAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-black">
              {profileSetup ? t('fd.overview.welcomeTitle', 'Namaste, {{name}}! 🙏', { name: farmerName }) : t('farmerDash.title', 'Farmer Dashboard')}
            </h1>
            <p className="text-medium text-sm flex items-center gap-2 mt-1">
              {profileSetup ? (
                <>
                  <MapPin className="w-4 h-4 text-terracotta" />
                  {farmLocation} — {farmSize} Acres {cropType}
                </>
              ) : (
                t('fd.overview.welcomeSubtitle', 'Set up your profile to get started')
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVoice(!showVoice)}
              className={`p-3 rounded-xl transition-all ${showVoice ? 'bg-terracotta text-white shadow-lg' : 'bg-white text-terracotta shadow-sm hover:shadow-md border border-border'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-border">
              <Bell className="w-5 h-5 text-dark" />
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab('market'); setShowProductModal(true); }}
              className="hidden md:inline-flex items-center gap-2 px-5 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> New Listing
            </button>
          </div>
        </div>

        {/* Voice Assistant */}
        {showVoice && (
          <div className="mb-6 bg-gradient-to-r from-terracotta to-terracotta-light rounded-2xl p-6 text-white animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center animate-pulse-slow">
                <Mic className="w-7 h-7" />
              </div>
              <div>
                <p className="font-semibold">{t('home.voiceEnabled', 'Voice Assistant Active')}</p>
                <p className="text-sm text-white/70">Try: "Show pest alerts" or "What's my yield forecast?"</p>
              </div>
              <button onClick={() => setShowVoice(false)} className="ml-auto px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                {t('common.close', 'Close')}
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                activeTab === tab.key
                  ? 'bg-terracotta text-white shadow-md border-terracotta'
                  : 'bg-white text-dark hover:bg-light shadow-xs border-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TABS CONTENT */}
        <div className="min-h-[400px]">
          {/* PROFILE SETUP TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-terracotta" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-black">{t('fd.setup.title', 'Setup Your Farm Profile')}</h2>
                  <p className="text-medium text-sm mt-1">{t('fd.setup.subtitle', 'Fill in your details to get personalized recommendations')}</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.name', 'Full Name *')}</label>
                    <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} placeholder={t('fd.setup.name', 'Enter your name')} className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.location', 'Farm Location *')}</label>
                    <input type="text" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder={t('fd.setup.location', 'Village, District, State')} className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.size', 'Farm Size (Acres)')}</label>
                      <input type="text" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 5" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.crop', 'Primary Crop')}</label>
                      <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none">
                        <option value="">{t('fd.setup.select', 'Select crop')}</option>
                        <option value="Wheat">{t('marketplaceContext.crops.wheat', 'Wheat')}</option>
                        <option value="Rice">{t('marketplaceContext.crops.rice', 'Rice')}</option>
                        <option value="Mustard">{t('marketplaceContext.crops.mustard_gen', 'Mustard')}</option>
                        <option value="Soybean">{t('marketplaceContext.crops.soybean_gen', 'Soybean')}</option>
                        <option value="Chickpea">{t('marketplaceContext.crops.chickpea', 'Chickpea')}</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Sugarcane">Sugarcane</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.lang', 'Preferred Language')}</label>
                    <select 
                      value={i18n.language.split('-')[0]} 
                      onChange={(e) => i18n.changeLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none"
                    >
                      <option value="hi">हिन्दी</option>
                      <option value="en">English</option>
                      <option value="pa">ਪੰਜਾਬੀ</option>
                      <option value="mr">मराठी</option>
                      <option value="ta">தமிழ்</option>
                      <option value="te">తెలుగు</option>
                      <option value="bn">বাংলা</option>
                      <option value="gu">ગુજરાતી</option>
                    </select>
                  </div>
                  <button onClick={handleProfileSave} className="w-full py-4 bg-terracotta text-white font-heading font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-md text-base">
                    {t('fd.setup.save', 'Save & Continue')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {!profileSetup && (
                <div className="bg-gradient-to-r from-terracotta/10 to-amber/10 border-2 border-dashed border-terracotta/30 rounded-2xl p-6 md:p-8 text-center">
                  <User className="w-12 h-12 text-terracotta mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-bold text-black mb-2">{t('fd.overview.welcomeTitle', 'Welcome to KISAN MITRA!')}.</h3>
                  <p className="text-medium text-sm mb-4 max-w-md mx-auto">{t('fd.overview.welcomeSubtitle', 'Set up your farm profile to unlock personalized soil health reports, pest alerts, yield forecasts, and marketplace access.')}</p>
                  <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors shadow-md">
                    {t('fd.overview.welcomeBtn', 'Setup Farm Profile')}
                  </button>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: t('fd.stats.yield', 'Yield Forecast'), value: profileSetup ? '—' : t('fd.stats.setup', 'Setup required'), icon: TrendingUp, bg: 'bg-sage/10', color: 'text-sage' },
                  { label: t('fd.stats.price', 'Market Price'), value: profileSetup ? '—' : t('fd.stats.setup', 'Setup required'), icon: BarChart3, bg: 'bg-amber/10', color: 'text-amber' },
                  { label: t('fd.stats.pest', 'Pest Risk'), value: profileSetup ? 'Low' : '—', icon: Bug, bg: 'bg-terracotta/10', color: 'text-terracotta' },
                  { label: t('fd.stats.soil', 'Soil Health'), value: profileSetup ? 'High' : '—', icon: Leaf, bg: 'bg-info/10', color: 'text-info' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-xs border border-border hover:shadow-sm transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-sm text-muted">{stat.label}</p>
                    <p className="font-heading text-xl font-bold text-black">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Weather + Alerts */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                  <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber" /> {t('fd.weather.title', 'Weather Forecast')}
                  </h3>
                  <div className="flex justify-between items-center overflow-x-auto pb-2 gap-4">
                    {weatherLoading ? (
                      <div className="w-full py-4 text-center text-muted text-sm flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-amber/30 border-t-amber rounded-full animate-spin"></div>
                        {t('common.loading', 'Fetching local weather...')}
                      </div>
                    ) : locationError ? (
                      <div className="w-full py-4 text-center text-muted text-xs italic">
                        {t('fd.weather.noLocation', 'Enable location to see local weather')}
                      </div>
                    ) : weatherData ? (
                      weatherData.daily.time.slice(0, 5).map((time: string, i: number) => {
                        const date = new Date(time);
                        const dayName = i === 0 ? 'Today' : date.toLocaleDateString(i18n.language, { weekday: 'short' });
                        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[i]);
                        const rainProb = weatherData.daily.precipitation_probability_max[i];
                        
                        return (
                          <div key={i} className={`text-center p-3 rounded-xl min-w-[70px] ${i === 0 ? 'bg-amber/10 border border-amber/20' : ''}`}>
                            <p className="text-[10px] font-medium text-muted mb-2 uppercase">{dayName}</p>
                            <Sun className={`w-5 h-5 mx-auto mb-2 ${rainProb > 40 ? 'text-info' : 'text-amber'}`} />
                            <p className="text-sm font-bold text-black">{maxTemp}°C</p>
                            <p className="text-[10px] font-medium text-info">{rainProb}% 🌧️</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full py-4 text-center text-muted text-sm">{t('fd.weather.error', 'Weather unavailable')}</div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                      <Bug className="w-5 h-5 text-terracotta" /> {t('fd.pestAlert.title', 'Pest Alerts')}
                    </h3>
                    <button onClick={() => setActiveTab('pest')} className="text-terracotta text-sm font-medium hover:underline flex items-center gap-1">
                      {t('fd.pestAlert.view', 'View All')} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {profileSetup ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-offwhite rounded-xl text-center text-muted text-sm">{t('fd.pestAlert.noActive', 'No active pest alerts. Scan your traps to get started.')}</div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bug className="w-10 h-10 text-muted mx-auto mb-3" />
                      <p className="text-muted text-sm">{t('fd.pestAlert.noProfile', 'Setup your profile and scan traps to see pest alerts.')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Weather-Aware Task List */}
              {profileSetup && (
                <div className="relative overflow-hidden bg-gradient-to-br from-sage/8 via-white to-amber/5 rounded-2xl p-6 shadow-xs border border-sage/20">
                  {/* Decorative background orb */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-sage/5 rounded-full -mr-24 -mt-24 pointer-events-none" />

                  {/* Header */}
                  <div className="relative flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-sage/15 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-sage-dark" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-black leading-tight">
                          AI Weather-Aware Task Plan
                        </h3>
                        <p className="text-[11px] text-muted mt-0.5">
                          {cropType ? `${cropType} • Next 3 days` : 'Next 3 days'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateTasks()}
                      disabled={isLoadingTasks || !weatherData}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sage text-white rounded-lg text-xs font-semibold hover:bg-sage-dark transition-colors disabled:opacity-40 shadow-sm"
                    >
                      {isLoadingTasks
                        ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Sparkles className="w-3.5 h-3.5" />}
                      {weatherTasks.length > 0 ? 'Refresh' : 'Generate'}
                    </button>
                  </div>

                  {/* Content */}
                  {isLoadingTasks ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="w-10 h-10 border-[3px] border-sage/30 border-t-sage rounded-full animate-spin" />
                      <p className="text-sm text-muted font-medium">Analysing weather & generating tasks...</p>
                    </div>
                  ) : tasksError ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-terracotta mb-3">⚠️ Couldn't generate tasks. Check your Gemini API key or try again.</p>
                      <button onClick={() => handleGenerateTasks()} className="text-xs text-sage-dark underline">Retry</button>
                    </div>
                  ) : weatherTasks.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4 relative">
                      {weatherTasks.map((day, di) => {
                        const condIcon = day.condition === 'rainy' ? '🌧️' : day.condition === 'cloudy' ? '⛅' : '☀️';
                        const condColor = day.condition === 'rainy'
                          ? 'border-blue-200 bg-blue-50/60'
                          : day.condition === 'cloudy'
                          ? 'border-slate-200 bg-slate-50/60'
                          : 'border-amber-200 bg-amber-50/60';
                        const tagColor = day.condition === 'rainy'
                          ? 'bg-blue-100 text-blue-700'
                          : day.condition === 'cloudy'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-700';
                        return (
                          <div key={di} className={`rounded-xl border p-4 ${condColor} flex flex-col gap-3 animate-fade-in`}>
                            {/* Day header */}
                            <div className="flex items-center justify-between">
                              <span className="font-heading font-bold text-sm text-black">{day.day}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${tagColor}`}>
                                {condIcon} {day.condition}
                              </span>
                            </div>
                            {/* Tasks */}
                            <ul className="space-y-2">
                              {(day.tasks || []).map((task, ti) => (
                                <li key={ti} className="flex items-start gap-2">
                                  <div className="w-4 h-4 rounded-full bg-sage text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                    {ti + 1}
                                  </div>
                                  <p className="text-xs text-dark leading-snug">{task}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : !weatherData ? (
                    <div className="py-8 text-center">
                      <Sun className="w-10 h-10 text-amber/40 mx-auto mb-3" />
                      <p className="text-sm text-muted">Enable location access to get weather-based tasks.</p>
                    </div>
                  ) : !cropType ? (
                    <div className="py-8 text-center">
                      <Leaf className="w-10 h-10 text-sage/30 mx-auto mb-3" />
                      <p className="text-sm text-muted">Set your crop type in the <button onClick={() => setActiveTab('profile')} className="text-sage-dark underline font-medium">Profile</button> tab to generate tasks.</p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Sparkles className="w-10 h-10 text-sage/30 mx-auto mb-3" />
                      <p className="text-sm text-muted mb-4">Click Generate to get your AI-powered 3-day farming plan.</p>
                      <button
                        onClick={() => handleGenerateTasks()}
                        disabled={isLoadingTasks}
                        className="px-5 py-2.5 bg-sage text-white rounded-xl text-sm font-semibold hover:bg-sage-dark transition-colors shadow-sm inline-flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" /> Generate Task Plan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SOIL TAB */}
          {activeTab === 'soil' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
                <h3 className="font-heading text-xl font-semibold text-black mb-6">{t('fd.soil.title', 'Soil Health Monitor')}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wider">{t('fd.soil.ph', 'pH Level')}</label>
                    <input 
                      type="text" 
                      value={soilData.ph} 
                      onChange={(e) => setSoilData({...soilData, ph: e.target.value})}
                      placeholder="e.g. 6.5" 
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Nitrogen (N)</label>
                    <select 
                      value={soilData.n} 
                      onChange={(e) => setSoilData({...soilData, n: e.target.value})}
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta outline-none appearance-none"
                    >
                      <option value="">Select Level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Phosphorus (P)</label>
                    <select 
                      value={soilData.p} 
                      onChange={(e) => setSoilData({...soilData, p: e.target.value})}
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta outline-none appearance-none"
                    >
                      <option value="">Select Level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Potassium (K)</label>
                    <select 
                      value={soilData.k} 
                      onChange={(e) => setSoilData({...soilData, k: e.target.value})}
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta outline-none appearance-none"
                    >
                      <option value="">Select Level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  <button 
                    onClick={handleSoilAnalysis}
                    disabled={isSoilAnalyzing}
                    className="px-8 py-4 bg-gradient-to-r from-sage to-sage-dark text-white rounded-xl font-heading font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSoilAnalyzing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    {isSoilAnalyzing ? 'Analyzing...' : 'Generate AI Health Report'}
                  </button>
                </div>

                {soilAnalysis && (
                  <div className="animate-slide-up bg-white border border-sage/20 rounded-2xl p-6 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4 text-sage-dark">
                        <Sparkles className="w-5 h-5" />
                        <h4 className="font-heading font-bold text-lg">AI Soil Analyst Recommendations</h4>
                      </div>
                      <div className="prose prose-sm max-w-none text-dark leading-relaxed whitespace-pre-line">
                        {soilAnalysis}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PEST TAB */}
          {activeTab === 'pest' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                  <h3 className="font-heading text-xl font-semibold text-black mb-4">📸 Scan Pheromone Trap</h3>
                  <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-terracotta hover:bg-terracotta/5 transition-all cursor-pointer">
                    <Bug className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-dark font-medium mb-2">Upload Trap Photo</p>
                    <p className="text-sm text-muted mb-4">Take a clear photo of your sticky trap for AI analysis</p>
                    <button className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                      Open Camera
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DISEASE TAB */}
          {activeTab === 'disease' && (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
                <div className="text-center mb-8">
                  <h3 className="font-heading text-2xl font-bold text-black flex items-center justify-center gap-2">
                    <Camera className="w-8 h-8 text-sage" /> AI Disease Scanner
                  </h3>
                  <p className="text-medium text-sm mt-2">Upload a photo of a sick leaf, and our AI will identify the disease instantly.</p>
                </div>

                {!previewUrl ? (
                  <label className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-sage hover:bg-sage/5 transition-all cursor-pointer block">
                    <Upload className="w-12 h-12 text-sage mx-auto mb-4" />
                    <p className="text-dark font-medium mb-2">{t('fd.pest.uploadLeaf', 'Click to Upload Leaf Photo')}</p>
                    <p className="text-sm text-muted mb-4">{t('fd.pest.descLeaf', 'Photo of leaf showing symptoms for disease identification')}</p>
                    <div className="inline-flex px-6 py-3 bg-sage text-white rounded-xl font-semibold hover:bg-sage-dark transition-colors">
                      {t('fd.pest.btnCamera', 'Choose file')}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                  </label>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <img src={previewUrl} alt="Leaf Preview" className="max-h-64 object-contain rounded-xl border border-border shadow-sm" />
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => { setPreviewUrl(null); setSelectedFile(null); setPrediction(null); }}
                        className="px-6 py-3 bg-white text-dark border border-border rounded-xl font-semibold hover:bg-light transition-colors shadow-sm"
                      >
                        Clear Image
                      </button>
                      <button 
                        onClick={uploadAndPredict}
                        disabled={isPredicting}
                        className="px-6 py-3 bg-sage text-white rounded-xl font-semibold hover:bg-sage-dark transition-colors shadow-md disabled:bg-sage/50"
                      >
                        {isPredicting ? 'Analyzing...' : 'Identify Disease'}
                      </button>
                    </div>
                  </div>
                )}

                {isPredicting && (
                  <div className="mt-8 p-6 bg-sage/5 border border-sage/20 rounded-xl text-center">
                    <div className="w-10 h-10 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-medium text-sage-dark">Scanning leaf using AI...</p>
                  </div>
                )}

                {prediction && !isPredicting && (
                  <div className="mt-8 p-6 bg-white border border-border rounded-xl shadow-sm border-l-4 border-l-terracotta text-left">
                    <h4 className="font-heading text-lg font-bold text-black mb-1">Analysis Complete</h4>
                    
                    <div className="mt-4 bg-terracotta/5 p-4 rounded-xl border border-terracotta/20 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted mb-1">Detected Issue:</p>
                        <p className="font-heading text-2xl font-bold text-terracotta">{prediction.disease_name.replace(/_/g, ' ')}</p>
                      </div>
                      <button 
                        onClick={handleDiseaseAnalysis}
                        disabled={isDiseaseAnalysing}
                        className="flex items-center gap-2 px-4 py-3 bg-terracotta text-white rounded-xl text-sm font-bold shadow-md hover:bg-terracotta-dark transition-all disabled:opacity-50"
                      >
                        {isDiseaseAnalysing ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        Consult Doctor
                      </button>
                    </div>

                    <div className="mt-6 mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">AI Confidence Score</span>
                        <span className="text-sm font-bold text-sage-dark">{(prediction.confidence).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-light rounded-full h-2.5">
                        <div className="bg-sage h-2.5 rounded-full" style={{ width: `${Math.min(100, prediction.confidence)}%` }}></div>
                      </div>
                    </div>

                    {diseaseAnalysis && (
                      <div className="mt-6 animate-slide-up bg-sage/5 border border-sage/20 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sage/10 rounded-full -mr-12 -mt-12" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-3 text-sage-dark">
                            <Sparkles className="w-4 h-4" />
                            <h5 className="font-heading font-bold">Crop Doctor's Treatment Plan</h5>
                          </div>
                          <div className="prose prose-sm max-w-none text-dark leading-relaxed whitespace-pre-line text-sm">
                            {diseaseAnalysis}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCHEMES TAB */}
          {activeTab === 'schemes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-6">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-black flex items-center gap-2">
                      🏛️ Government Schemes Finder
                    </h3>
                    <p className="text-medium text-xs mt-1">
                      Access all eligible central and state government schemes instantly based on your farm profile.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                    <input 
                      type="text" 
                      placeholder="Search schemes..." 
                      value={schemesSearch}
                      onChange={(e) => setSchemesSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-offwhite border border-border rounded-xl text-xs focus:border-terracotta outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-2 px-2 scrollbar-none">
                  {['All', 'Income Support', 'Credit', 'Insurance', 'Soil', 'Marketplace', 'Subsidies', 'Irrigation'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedSchemeCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        selectedSchemeCategory === cat
                          ? 'bg-emerald-600 text-white shadow-sm border-emerald-600'
                          : 'bg-offwhite text-dark hover:bg-light border-border'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Loading State */}
                {schemesLoading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="rounded-xl p-5 border border-border bg-offwhite/50 animate-pulse flex flex-col gap-3 min-h-[160px]">
                        <div className="h-4 bg-border rounded w-2/3"></div>
                        <div className="h-3 bg-border rounded w-full"></div>
                        <div className="h-3 bg-border rounded w-5/6"></div>
                        <div className="mt-auto h-8 bg-border rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredSchemes.length === 0 ? (
                  <div className="py-12 text-center bg-offwhite/30 rounded-xl border-2 border-dashed border-border">
                    <AlertCircle className="w-10 h-10 text-muted mx-auto mb-3" />
                    <p className="font-semibold text-black text-sm">No Schemes Found</p>
                    <p className="text-xs text-muted mt-1">Try resetting your search query or choosing another category.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSchemes.map((scheme) => {
                      // Custom colors based on category
                      let catColor = 'bg-slate-50 border-slate-200 hover:bg-slate-100/50';
                      let pillColor = 'bg-slate-100 text-slate-700';
                      
                      const cat = scheme.category.toLowerCase();
                      if (cat === 'income support') {
                        catColor = 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50';
                        pillColor = 'bg-emerald-100 text-emerald-800';
                      } else if (cat === 'credit') {
                        catColor = 'bg-blue-50/50 border-blue-200 hover:bg-blue-50';
                        pillColor = 'bg-blue-100 text-blue-800';
                      } else if (cat === 'insurance') {
                        catColor = 'bg-amber-50/50 border-amber-200 hover:bg-amber-50';
                        pillColor = 'bg-amber-100 text-amber-800';
                      } else if (cat === 'soil') {
                        catColor = 'bg-sage/10 border-sage/20 hover:bg-sage/15';
                        pillColor = 'bg-sage text-sage-dark';
                      } else if (cat === 'marketplace') {
                        catColor = 'bg-terracotta/5 border-terracotta/20 hover:bg-terracotta/10';
                        pillColor = 'bg-terracotta/10 text-terracotta-dark';
                      } else if (cat === 'subsidies') {
                        catColor = 'bg-purple-50/50 border-purple-200 hover:bg-purple-50';
                        pillColor = 'bg-purple-100 text-purple-800';
                      } else if (cat === 'irrigation') {
                        catColor = 'bg-teal-50/50 border-teal-200 hover:bg-teal-50';
                        pillColor = 'bg-teal-100 text-teal-800';
                      }

                      return (
                        <div key={scheme.id} className={`rounded-xl p-5 border ${catColor} flex flex-col gap-3 transition-all hover:shadow-sm duration-300 group`}>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-heading font-semibold text-black text-sm leading-snug group-hover:text-terracotta transition-colors">{scheme.name}</h4>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 shadow-xs ${pillColor}`}>
                              {scheme.category}
                            </span>
                          </div>
                          <p className="text-medium text-xs leading-relaxed flex-1">{scheme.description}</p>
                          
                          {/* Quick Benefit Indicator */}
                          <div className="text-[10px] text-muted-dark border-t border-border/40 pt-2.5 flex items-center gap-1.5 font-medium">
                            💰 <span className="font-semibold text-dark">Benefit:</span> {scheme.benefits[0]}
                          </div>

                          <button 
                            onClick={() => handleCheckEligibility(scheme)}
                            className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Check Eligibility
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Glassmorphic Details & AI Eligibility Modal */}
              {selectedSchemeForModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                  <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border animate-slide-up max-h-[85vh] flex flex-col">
                    {/* Header banner */}
                    <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full font-bold uppercase tracking-wider">{selectedSchemeForModal.category}</span>
                        <h4 className="font-heading text-lg md:text-xl font-bold mt-1 leading-tight">{selectedSchemeForModal.name}</h4>
                      </div>
                      <button 
                        onClick={() => setSelectedSchemeForModal(null)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 scrollbar-thin text-left">
                      {/* Description */}
                      <div>
                        <h5 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">About Scheme</h5>
                        <p className="text-sm text-dark leading-relaxed">{selectedSchemeForModal.description}</p>
                      </div>

                      {/* Official Benefits list */}
                      <div>
                        <h5 className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">Official Benefits</h5>
                        <ul className="space-y-2">
                          {selectedSchemeForModal.benefits.map((benefit, bIndex) => (
                            <li key={bIndex} className="flex items-start gap-2.5 text-xs text-dark leading-relaxed">
                              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✔</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Profile eligibility matching indicator (Rule-Based quick checker) */}
                      <div className="p-4 rounded-2xl bg-offwhite/50 border border-border/80 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">Fast Profile Match Status</p>
                          <p className="text-[11px] text-muted mt-0.5">
                            {profileSetup 
                              ? `Verified matching criteria for ${cropType || 'crops'} on ${farmSize || '0'} acres of land.` 
                              : 'Profile not set up yet. AI cannot perform direct verification matches.'}
                          </p>
                        </div>
                      </div>

                      {/* AI personalized recommendations report */}
                      <div className="border-t border-border/60 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                          <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">KisanMitra AI Personalized Advisor</h5>
                        </div>

                        {!profileSetup ? (
                          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center">
                            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                            <p className="text-xs font-bold text-black mb-1">Set Up Your Profile for AI Advisor Match</p>
                            <p className="text-[11px] text-muted mb-4 max-w-sm mx-auto">
                              By filling out your name, location, and crop type, the KisanMitra AI can run a localized eligibility simulation and generate custom document checklists.
                            </p>
                            <button 
                              onClick={() => { setSelectedSchemeForModal(null); setActiveTab('profile'); }}
                              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 mx-auto"
                            >
                              <User className="w-3.5 h-3.5" /> Set Up Profile Now
                            </button>
                          </div>
                        ) : eligibilityLoading ? (
                          <div className="p-8 rounded-2xl bg-emerald-50/10 border border-emerald-200/30 text-center flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-3 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                            <p className="text-xs font-semibold text-emerald-800">KisanMitra AI is analyzing your eligibility...</p>
                            <p className="text-[10px] text-muted">Checking crop matching, location boundaries, and subsidy catalogs...</p>
                          </div>
                        ) : eligibilityAnalysis ? (
                          <div className="p-5 rounded-2xl bg-emerald-50/20 border border-emerald-200/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                            <div className="relative text-xs text-dark leading-relaxed whitespace-pre-line prose max-w-none">
                              {eligibilityAnalysis}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl text-center text-xs text-muted bg-offwhite/50 border border-border">
                            Unable to compile recommendations. Please use the official link below to review requirements.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-offwhite border-t border-border flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => setSelectedSchemeForModal(null)}
                        className="px-5 py-3 border border-border hover:bg-light text-dark text-xs font-semibold rounded-xl transition-all outline-none order-last sm:order-first"
                      >
                        Cancel
                      </button>
                      <a 
                        href={selectedSchemeForModal.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 flex-1"
                      >
                        <ExternalLink className="w-4 h-4" /> Apply on Official Portal
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Add / Edit Crop Modal */}
              {(showProductModal || editingProduct) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
                  <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-scale-up">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-sage/20 to-emerald-800/5 border-b border-border flex justify-between items-center">
                      <div>
                        <h4 className="font-heading text-lg md:text-xl font-bold text-black">
                          {editingProduct ? 'Edit Crop Listing' : 'List New Crop / Produce'}
                        </h4>
                        <p className="text-xs text-muted mt-0.5 font-medium">Fill out all active crop parameters to update the marketplace.</p>
                      </div>
                      <button
                        onClick={() => { setShowProductModal(false); resetForm(); }}
                        className="p-2 text-muted hover:text-dark rounded-full hover:bg-light transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
                      {/* Name & Type */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Crop Name *</label>
                          <input
                            type="text"
                            required
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            placeholder="e.g. Premium Basmati Rice"
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Listing Type *</label>
                          <div className="flex bg-offwhite p-1 rounded-xl border border-border">
                            <button
                              type="button"
                              onClick={() => setProdType('PRODUCE')}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                prodType === 'PRODUCE'
                                  ? 'bg-white text-sage-dark shadow-sm'
                                  : 'text-muted hover:text-dark'
                              }`}
                            >
                              Fresh Produce
                            </button>
                            <button
                              type="button"
                              onClick={() => setProdType('INPUT')}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                prodType === 'INPUT'
                                  ? 'bg-white text-sage-dark shadow-sm'
                                  : 'text-muted hover:text-dark'
                              }`}
                            >
                              Farming Input
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Category & Farming Method */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Category *</label>
                          <select
                            required
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none"
                          >
                            <option value="">Select Category</option>
                            {dbCategories.map((c) => (
                              <option key={c.category_id} value={c.category_id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Farming Method</label>
                          <select
                            value={prodFarmingMethod}
                            onChange={(e) => setProdFarmingMethod(e.target.value)}
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none"
                          >
                            <option value="Organic">Organic</option>
                            <option value="Traditional">Traditional</option>
                            <option value="Natural">Natural</option>
                            <option value="Hydroponic">Hydroponic</option>
                            <option value="Conventional">Conventional</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-dark mb-1.5">Description / Variety Details</label>
                        <textarea
                          rows={3}
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          placeholder="Provide details about seed quality, pesticide-free harvest, variety (e.g. PB-1121 basmati)..."
                          className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all resize-none"
                        />
                      </div>

                      {/* Price, Stock & Unit */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Price (₹) *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={prodPrice}
                            onChange={(e) => setProdPrice(e.target.value)}
                            placeholder="e.g. 75"
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
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
                            placeholder="e.g. 500"
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Unit of Measure *</label>
                          <select
                            value={prodUnit}
                            onChange={(e) => setProdUnit(e.target.value)}
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none"
                          >
                            <option value="kg">kg</option>
                            <option value="quintal">quintal</option>
                            <option value="ton">ton</option>
                            <option value="litre">litre</option>
                            <option value="piece">piece</option>
                            <option value="bag">bag</option>
                            <option value="box">box</option>
                          </select>
                        </div>
                      </div>

                      {/* Harvest Date & Shelf Life */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Harvest Date</label>
                          <input
                            type="date"
                            value={prodHarvestDate}
                            onChange={(e) => setProdHarvestDate(e.target.value)}
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1.5">Expected Shelf Life (Days)</label>
                          <input
                            type="number"
                            value={prodShelfLife}
                            onChange={(e) => setProdShelfLife(e.target.value)}
                            placeholder="e.g. 180"
                            className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Crop Image Upload */}
                      <div>
                        <label className="block text-xs font-bold text-dark mb-1.5">Crop Image</label>
                        {prodImageUrl ? (
                          <div className="relative rounded-xl overflow-hidden border border-border h-48 bg-offwhite flex items-center justify-center group/img">
                            <img
                              src={prodImageUrl.startsWith('http') ? prodImageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${prodImageUrl}`}
                              alt="Crop Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setProdImageUrl('')}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs rounded-xl gap-2"
                            >
                              <Trash2 className="w-5 h-5 text-red-400" /> Remove Image
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-6 bg-offwhite hover:bg-sage/5 hover:border-sage/40 transition-all cursor-pointer">
                            <div className="flex flex-col items-center text-center gap-1.5">
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
                                  <span className="text-xs font-medium text-dark mt-1">Uploading image...</span>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-8 h-8 text-sage-dark/65" />
                                  <span className="text-xs font-medium text-dark">Click to upload crop image</span>
                                  <span className="text-[10px] text-muted">Supports JPG, PNG, WEBP</span>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={handleProductImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Submit buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <button
                          type="button"
                          onClick={() => { setShowProductModal(false); resetForm(); }}
                          className="px-5 py-3 border border-border text-dark text-xs font-bold rounded-xl hover:bg-light transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingProduct || uploadingImage}
                          className="px-6 py-3 bg-terracotta text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-terracotta-dark disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                          {submittingProduct && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {editingProduct ? 'Save Changes' : 'Publish Crop'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MARKET TAB */}
          {activeTab === 'market' && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-sage/20 to-emerald-800/5 rounded-2xl p-6 border border-sage/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-black flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-terracotta" />
                    {t('fd.market.title', 'Marketplace Producer Panel')}
                  </h3>
                  <p className="text-muted text-sm mt-1">Manage your active produce listings, track sales, and fulfill buyer orders.</p>
                </div>
                <button
                  onClick={() => { resetForm(); setShowProductModal(true); }}
                  className="flex items-center gap-2 px-5 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  {t('fd.listings.addCrop', 'List New Crop')}
                </button>
              </div>

              {loadingMarket ? (
                <div className="py-20 flex justify-center items-center">
                  <Loader2 className="w-10 h-10 animate-spin text-terracotta" />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Active Produce Section */}
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-heading text-lg font-bold text-black flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-sage-dark" />
                        Active Harvest Listings ({farmerProducts.length})
                      </h4>
                    </div>

                    {farmerProducts.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-border rounded-xl">
                        <Package className="w-12 h-12 text-muted mx-auto mb-3" />
                        <h5 className="font-heading text-base font-bold text-black mb-1">No crops listed for sale</h5>
                        <p className="text-muted text-sm mb-4 max-w-sm mx-auto">Get your harvest in front of hundreds of buyers. Add a listing to start selling!</p>
                        <button
                          onClick={() => { resetForm(); setShowProductModal(true); }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-sage-dark text-white rounded-xl text-sm font-semibold hover:bg-sage-dark/95 transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Listing
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {farmerProducts.map((prod) => (
                          <div key={prod.product_id} className="group bg-offwhite rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-sage/40 transition-all flex flex-col justify-between">
                            <div>
                              {/* Product Image */}
                              <div className="h-44 bg-border relative overflow-hidden flex items-center justify-center">
                                {prod.image_url ? (
                                  <img
                                    src={prod.image_url.startsWith('http') ? prod.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${prod.image_url}`}
                                    alt={prod.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-muted bg-sage/5 gap-2">
                                    <Leaf className="w-10 h-10 text-sage/35 animate-pulse" />
                                    <span className="text-xs">No image uploaded</span>
                                  </div>
                                )}
                                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-xs ${
                                  prod.farming_method?.toLowerCase() === 'organic'
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                    : 'bg-amber/10 text-amber border border-amber/20'
                                }`}>
                                  {prod.farming_method || 'Conventional'}
                                </span>
                              </div>

                              {/* Details */}
                              <div className="p-4 space-y-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-sage-dark bg-sage/10 px-2 py-0.5 rounded">
                                  {dbCategories.find(c => c.category_id === prod.category_id)?.name || 'Produce'}
                                </span>
                                <h5 className="font-heading font-bold text-black text-base truncate">{prod.name}</h5>
                                <p className="text-muted text-xs line-clamp-2 min-h-[2rem]">{prod.description || 'No description provided.'}</p>
                                
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                                  <div>
                                    <p className="text-[10px] text-muted uppercase tracking-wider">Price</p>
                                    <p className="font-heading font-bold text-terracotta text-sm">₹{parseFloat(prod.price_per_unit)} <span className="text-xs text-muted font-normal">/ {prod.unit_of_measure}</span></p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted uppercase tracking-wider">Stock Available</p>
                                    <p className="font-heading font-bold text-black text-sm">{parseFloat(prod.stock_quantity)} <span className="text-xs text-muted font-normal">{prod.unit_of_measure}</span></p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-border/20 border-t border-border flex justify-end gap-2">
                              <button
                                onClick={() => populateForm(prod)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-dark text-xs font-bold rounded-lg hover:border-terracotta/40 hover:text-terracotta transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.product_id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Incoming Orders Section */}
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                    <h4 className="font-heading text-lg font-bold text-black flex items-center gap-2 mb-6">
                      <CreditCard className="w-5 h-5 text-terracotta" />
                      Incoming Purchase Orders ({farmerOrders.length})
                    </h4>

                    {farmerOrders.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-border rounded-xl">
                        <Clock className="w-12 h-12 text-muted mx-auto mb-3" />
                        <h5 className="font-heading text-base font-bold text-black mb-1">No orders yet</h5>
                        <p className="text-muted text-sm max-w-sm mx-auto">When buyers purchase your listed crops in the marketplace, their orders and delivery requirements will appear here instantly.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {farmerOrders.map((order) => {
                          // Find items in this order that belong to the farmer
                          const myItems = order.items.filter(item => {
                            const p = farmerProducts.find(fp => fp.product_id === item.product_id);
                            return p !== undefined;
                          });

                          if (myItems.length === 0) return null; // safety filter

                          // Compute total earnings for this farmer from this order
                          const myOrderTotal = myItems.reduce((sum, item) => sum + parseFloat(item.price_at_purchase) * parseFloat(item.quantity), 0);

                          return (
                            <div key={order.order_id} className="bg-offwhite rounded-2xl p-5 border border-border flex flex-col gap-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border/50 pb-3">
                                <div>
                                  <span className="text-[10px] font-bold text-muted tracking-wide uppercase">Order ID: #{order.order_id}</span>
                                  <h5 className="font-heading font-bold text-black text-sm">Placed on: {new Date(order.created_at).toLocaleDateString()}</h5>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted font-medium">Delivery Status:</span>
                                  <select
                                    value={order.current_status}
                                    onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value as OrderStatus)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold outline-none border focus:ring-1 focus:ring-terracotta/20 cursor-pointer shadow-xs transition-all ${
                                      order.current_status === 'PENDING' ? 'bg-amber/10 text-amber border-amber/20' :
                                      order.current_status === 'CONFIRMED' ? 'bg-sage/20 text-sage-dark border-sage/35' :
                                      order.current_status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                      order.current_status === 'SHIPPED' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                      order.current_status === 'OUT_FOR_DELIVERY' ? 'bg-teal-500/10 text-teal-600 border-teal-500/20' :
                                      order.current_status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                      'bg-red-500/10 text-red-600 border-red-500/20'
                                    }`}
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

                              {/* Items list */}
                              <div className="space-y-3">
                                {myItems.map((item, idx) => {
                                  const p = farmerProducts.find(fp => fp.product_id === item.product_id);
                                  return (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-border/40">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center text-sage-dark font-bold text-xs">
                                          {p?.name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                          <h6 className="font-heading font-bold text-black text-sm">{p?.name || 'Produce Listing'}</h6>
                                          <p className="text-muted text-xs">Qty: {parseFloat(item.quantity)} {p?.unit_of_measure || 'kg'} @ ₹{parseFloat(item.price_at_purchase)}/{p?.unit_of_measure || 'kg'}</p>
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
                                <span className="text-xs text-muted">Buyer ID: {order.buyer_id}</span>
                                <div className="text-right">
                                  <span className="text-xs text-muted block">Your Total Earnings</span>
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
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                  <p className="text-sm text-muted">Total Earnings</p>
                  <p className="font-heading text-3xl font-bold text-emerald-600 mt-2">₹{totalFarmerEarnings.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted mt-1">This season</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                  <p className="text-sm text-muted">Completed Sales</p>
                  <p className="font-heading text-3xl font-bold text-black mt-2">{completedFarmerOrdersCount}</p>
                  <p className="text-xs text-muted mt-1">Delivered crops</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                  <p className="text-sm text-muted">Pending Orders</p>
                  <p className="font-heading text-3xl font-bold text-amber mt-2">{pendingFarmerOrdersCount}</p>
                  <p className="text-xs text-muted mt-1">Awaiting dispatch</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                  <p className="text-sm text-muted">Farmer Score</p>
                  <p className="font-heading text-3xl font-bold text-sage mt-2">
                    {completedFarmerOrdersCount > 0 ? '9.8' : '—'}
                  </p>
                  <p className="text-xs text-muted mt-1">Build trust with buyers</p>
                </div>
              </div>

              {/* Transactions Table Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border overflow-hidden">
                <h3 className="font-heading text-lg font-bold text-black mb-4">Historical Transaction Settlements</h3>
                
                {farmerTransactions.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                    <CreditCard className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h5 className="font-heading text-base font-bold text-black mb-1">No settled transactions yet</h5>
                    <p className="text-muted text-sm max-w-sm mx-auto">When crops are purchased and paid for, your escrow settlements and earnings list will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-border/80 text-xs font-bold text-muted uppercase tracking-wider">
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Crops Sold</th>
                          <th className="py-3 px-4">Buyer ID</th>
                          <th className="py-3 px-4">Settled Status</th>
                          <th className="py-3 px-4 text-right">Your Earnings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {farmerTransactions.map((txn, idx) => (
                          <tr key={idx} className="text-sm hover:bg-offwhite/50 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-xs text-muted">#{txn.orderId}</td>
                            <td className="py-4 px-4 text-xs font-medium text-black">{txn.date}</td>
                            <td className="py-4 px-4 font-semibold text-black max-w-xs truncate" title={txn.itemsSummary}>{txn.itemsSummary}</td>
                            <td className="py-4 px-4 text-xs text-muted">Buyer #{txn.buyerId}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shadow-2xs uppercase tracking-wide ${
                                txn.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                txn.status === 'CONFIRMED' ? 'bg-sage/20 text-sage-dark border-sage/35' :
                                'bg-blue-500/10 text-blue-600 border-blue-500/20'
                              }`}>
                                {txn.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-heading font-bold text-emerald-600">₹{txn.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
