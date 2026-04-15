import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, Bug, TrendingUp, Bell,
  Droplets, Thermometer, Sun, Wind, Plus,
  MapPin, ChevronRight, BarChart3,
  ShoppingCart, Package, CreditCard, AlertTriangle,
  Mic, Settings, User, Upload, BookOpen
} from 'lucide-react';

type Tab = 'overview' | 'soil' | 'pest' | 'schemes' | 'market' | 'transactions' | 'profile';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showVoice, setShowVoice] = useState(false);
  const [profileSetup, setProfileSetup] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [cropType, setCropType] = useState('');

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'soil', label: 'Soil Health', icon: Leaf },
    { key: 'pest', label: 'Pest Monitor', icon: Bug },
    { key: 'schemes', label: 'Gov Schemes', icon: BookOpen},
    { key: 'market', label: 'Marketplace', icon: ShoppingCart },
    { key: 'transactions', label: 'Transactions', icon: CreditCard },
    { key: 'profile', label: 'Profile', icon: Settings },
  ];

  const handleProfileSave = () => {
    if (farmerName && farmLocation) {
      setProfileSetup(true);
      setActiveTab('overview');
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-black">
              {profileSetup ? `Namaste, ${farmerName}! 🙏` : 'Farmer Dashboard'}
            </h1>
            <p className="text-medium text-sm flex items-center gap-2 mt-1">
              {profileSetup ? (
                <>
                  <MapPin className="w-4 h-4 text-terracotta" />
                  {farmLocation} — {farmSize} Acres {cropType}
                </>
              ) : (
                'Set up your profile to get started'
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
            <Link
              to="/marketplace"
              className="hidden md:inline-flex items-center gap-2 px-5 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> New Listing
            </Link>
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
                <p className="font-semibold">Voice Assistant Active</p>
                <p className="text-sm text-white/70">Try: "Show pest alerts" or "What's my yield forecast?"</p>
              </div>
              <button onClick={() => setShowVoice(false)} className="ml-auto px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                Close
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

        {/* PROFILE SETUP TAB */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-terracotta" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-black">Setup Your Farm Profile</h2>
                <p className="text-medium text-sm mt-1">Fill in your details to get personalized recommendations</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Full Name *</label>
                  <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} placeholder="Enter your name" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Farm Location *</label>
                  <input type="text" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="Village, District, State" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Farm Size (Acres)</label>
                    <input type="text" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 5" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Primary Crop</label>
                    <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none">
                      <option value="">Select crop</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Mustard">Mustard</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Chickpea">Chickpea</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Sugarcane">Sugarcane</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Preferred Language</label>
                  <select className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none">
                    <option>Hindi</option>
                    <option>English</option>
                    <option>Punjabi</option>
                    <option>Marathi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                    <option>Bengali</option>
                    <option>Gujarati</option>
                  </select>
                </div>
                <button onClick={handleProfileSave} className="w-full py-4 bg-terracotta text-white font-heading font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-md text-base">
                  Save & Continue
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
                <h3 className="font-heading text-xl font-bold text-black mb-2">Welcome to KISAN MITRA!</h3>
                <p className="text-medium text-sm mb-4 max-w-md mx-auto">Set up your farm profile to unlock personalized soil health reports, pest alerts, yield forecasts, and marketplace access.</p>
                <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors shadow-md">
                  Setup Farm Profile
                </button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Yield Forecast', value: profileSetup ? '—' : 'Setup required', icon: TrendingUp, bg: 'bg-sage/10', color: 'text-sage' },
                { label: 'Market Price', value: profileSetup ? '—' : 'Setup required', icon: BarChart3, bg: 'bg-amber/10', color: 'text-amber' },
                { label: 'Pest Risk', value: profileSetup ? 'Low' : '—', icon: Bug, bg: 'bg-terracotta/10', color: 'text-terracotta' },
                { label: 'Soil Health', value: profileSetup ? '—' : 'Connect sensors', icon: Leaf, bg: 'bg-info/10', color: 'text-info' },
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
                  <Sun className="w-5 h-5 text-amber" /> Weather Forecast
                </h3>
                <div className="flex justify-between">
                  {[
                    { day: 'Today', icon: Sun, temp: '28°C', rain: '0%' },
                    { day: 'Tue', icon: Sun, temp: '30°C', rain: '5%' },
                    { day: 'Wed', icon: Wind, temp: '27°C', rain: '20%' },
                    { day: 'Thu', icon: Droplets, temp: '24°C', rain: '60%' },
                    { day: 'Fri', icon: Sun, temp: '29°C', rain: '10%' },
                  ].map((d, i) => (
                    <div key={i} className={`text-center p-2 rounded-xl ${i === 0 ? 'bg-amber/10' : ''}`}>
                      <p className="text-xs text-muted mb-2">{d.day}</p>
                      <d.icon className={`w-5 h-5 mx-auto mb-2 ${i === 3 ? 'text-info' : 'text-amber'}`} />
                      <p className="text-sm font-bold text-black">{d.temp}</p>
                      <p className="text-[10px] text-info">{d.rain}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                    <Bug className="w-5 h-5 text-terracotta" /> Pest Alerts
                  </h3>
                  <button onClick={() => setActiveTab('pest')} className="text-terracotta text-sm font-medium hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {profileSetup ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-offwhite rounded-xl text-center text-muted text-sm">No active pest alerts. Scan your traps to get started.</div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bug className="w-10 h-10 text-muted mx-auto mb-3" />
                    <p className="text-muted text-sm">Setup your profile and scan traps to see pest alerts.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Listings */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                  <Package className="w-5 h-5 text-sage" /> My Listings
                </h3>
                <Link to="/marketplace" className="text-terracotta text-sm font-medium hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> New Listing
                </Link>
              </div>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                <Package className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">No Listings Yet</h4>
                <p className="text-muted text-sm mb-4">Create your first listing to start connecting with verified buyers.</p>
                <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                  <Plus className="w-4 h-4" /> Create Listing
                </Link>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-clay" /> Recent Transactions
              </h3>
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">Your transactions will appear here once you start selling.</p>
              </div>
            </div>
          </div>
        )}

        {/* SOIL TAB */}
        {activeTab === 'soil' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-6">Soil Health Monitor</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'pH Level', icon: Leaf, placeholder: 'Not measured', status: 'pending' },
                  { label: 'Nitrogen (N)', icon: Leaf, placeholder: 'Connect sensor', status: 'pending' },
                  { label: 'Phosphorus (P)', icon: AlertTriangle, placeholder: 'Connect sensor', status: 'pending' },
                  { label: 'Potassium (K)', icon: Leaf, placeholder: 'Connect sensor', status: 'pending' },
                  { label: 'Moisture', icon: Droplets, placeholder: 'Connect sensor', status: 'pending' },
                  { label: 'Temperature', icon: Thermometer, placeholder: 'Connect sensor', status: 'pending' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5 border-2 border-dashed border-border bg-offwhite">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted">{item.label}</span>
                      <item.icon className="w-4 h-4 text-muted" />
                    </div>
                    <p className="font-heading text-xl font-bold text-muted">{item.placeholder}</p>
                  </div>
                ))}
              </div>
              <div className="bg-terracotta/5 border border-terracotta/20 rounded-xl p-6 text-center">
                <Upload className="w-10 h-10 text-terracotta mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">Connect Sensors or Upload Lab Report</h4>
                <p className="text-medium text-sm mb-4">Pair IoT sensors via Bluetooth/LoRa or upload your soil test report to get started.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                    Pair Sensor
                  </button>
                  <button className="px-6 py-3 bg-white text-terracotta border-2 border-terracotta rounded-xl font-semibold hover:bg-terracotta/5 transition-colors">
                    Upload Lab Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PEST TAB */}
        {activeTab === 'pest' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
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
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                <h3 className="font-heading text-xl font-semibold text-black mb-4">🍃 Scan Leaf / Crop</h3>
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-sage hover:bg-sage/5 transition-all cursor-pointer">
                  <Leaf className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-dark font-medium mb-2">Upload Leaf Photo</p>
                  <p className="text-sm text-muted mb-4">Photo of leaf showing symptoms for disease identification</p>
                  <button className="px-6 py-3 bg-sage text-white rounded-xl font-semibold hover:bg-sage-dark transition-colors">
                    Open Camera
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">Pest Activity History</h3>
              <div className="p-8 text-center">
                <Bug className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">No scans yet. Upload trap or leaf photos to see detection results here.</p>
              </div>
            </div>
          </div>
        )}

        {/* SCHEMES TAB */}
        {activeTab === 'schemes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-6">Government Schemes Finder</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'PM Kisan Samman Nidhi', desc: '₹6,000/year direct income support for eligible farmers.', tag: 'Income Support', color: 'bg-emerald-50 border-emerald-200' },
                  { name: 'Kisan Credit Card (KCC)', desc: 'Low-interest credit for crop inputs, equipment and emergencies.', tag: 'Credit', color: 'bg-blue-50 border-blue-200' },
                  { name: 'PM Fasal Bima Yojana', desc: 'Crop insurance against drought, flood and pest damage.', tag: 'Insurance', color: 'bg-amber-50 border-amber-200' },
                  { name: 'Soil Health Card', desc: 'Free soil testing and fertilizer recommendation by government labs.', tag: 'Soil', color: 'bg-sage/10 border-sage/30' },
                  { name: 'eNAM', desc: 'Sell crops at best mandi prices through the national digital marketplace.', tag: 'Marketplace', color: 'bg-terracotta/10 border-terracotta/30' },
                  { name: 'Fertilizer Subsidy', desc: 'Subsidised urea, DAP and other inputs via PM PRANAM scheme.', tag: 'Input Support', color: 'bg-purple-50 border-purple-200' },
                ].map((scheme, i) => (
                  <div key={i} className={`rounded-xl p-5 border ${scheme.color} flex flex-col gap-3`}>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-heading font-semibold text-black text-sm leading-snug">{scheme.name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-white/70 rounded-full border border-border text-medium shrink-0">{scheme.tag}</span>
                    </div>
                    <p className="text-medium text-xs leading-relaxed flex-1">{scheme.desc}</p>
                    <button className="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Check Eligibility
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MARKET TAB */}
        {activeTab === 'market' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">Your Marketplace</h3>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">Start Selling</h4>
                <p className="text-muted text-sm mb-4 max-w-md mx-auto">Create listings for your produce, compare buyer offers, and sell at the best price with escrow protection.</p>
                <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                  <Plus className="w-4 h-4" /> Create Listing
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">Price Trends</h3>
              <p className="text-muted text-sm mb-4">Select your crop to see current prices and forecasts.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Wheat', 'Rice', 'Mustard', 'Soybean'].map((crop) => (
                  <button key={crop} className="p-4 bg-offwhite border border-border rounded-xl text-center hover:border-terracotta hover:bg-terracotta/5 transition-all">
                    <p className="text-sm font-semibold text-black">{crop}</p>
                    <p className="text-xs text-muted mt-1">View prices</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                <p className="text-sm text-muted">Total Earnings</p>
                <p className="font-heading text-3xl font-bold text-black mt-2">₹0</p>
                <p className="text-xs text-muted mt-1">This season</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                <p className="text-sm text-muted">Farmer Score</p>
                <p className="font-heading text-3xl font-bold text-amber mt-2">—</p>
                <p className="text-xs text-muted mt-1">Complete sales to build score</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                <p className="text-sm text-muted">Completed Orders</p>
                <p className="font-heading text-3xl font-bold text-black mt-2">0</p>
                <p className="text-xs text-muted mt-1">No disputes</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">Transaction History</h3>
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">No transactions yet. Start selling to see your payment history and Farmer Score.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
