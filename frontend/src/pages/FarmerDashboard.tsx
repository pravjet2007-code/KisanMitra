import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Bug, Plane, TrendingUp, Bell,
  Droplets, Thermometer, Sun, Plus,
  MapPin, ChevronRight, BarChart3,
  ShoppingCart, Package, CreditCard, AlertTriangle,
  Mic, Settings, User, Upload
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

type Tab = 'overview' | 'soil' | 'pest' | 'drone' | 'market' | 'transactions' | 'profile';

export default function FarmerDashboard() {
  const { t, i18n } = useTranslation();
  const { user, token, fetchProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Local state for edits
  const [farmerName, setFarmerName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [cropType, setCropType] = useState('');

  const profileSetup = Boolean(user?.name && user?.location && user?.crop_type);

  // Sync state when User loads
  useEffect(() => {
    if (user) {
      setFarmerName(user.name || '');
      setFarmLocation(user.location || '');
      setFarmSize(user.farm_size || '');
      setCropType(user.crop_type || '');
    }
  }, [user]);

  // Auth Guard
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const [weatherData, setWeatherData] = useState<any>(null);
  const [agriData, setAgriData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationName, setLocationName] = useState('Your Farm');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Location access denied or failed", error);
          fetchWeatherData(18.5204, 73.8567); // Fallback to Pune
          setLocationName('Pune (Fallback)');
        }
      );
    } else {
      fetchWeatherData(18.5204, 73.8567);
      setLocationName('Pune (Fallback)');
    }
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setWeatherLoading(true);
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,et0_fao_evapotranspiration&hourly=soil_moisture_0_to_1cm&timezone=auto`);
      const data = await res.json();
      
      setWeatherData(data);
      
      const currentHour = new Date().getHours();
      const currentSoilMoisture = data.hourly?.soil_moisture_0_to_1cm?.[currentHour] || 0;
      const todayEt0 = data.daily?.et0_fao_evapotranspiration?.[0] || 0;
      
      setAgriData({
        soilMoisture: currentSoilMoisture,
        et0: todayEt0
      });

    } catch (err) {
      console.error("Failed to fetch weather", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: t('farmerDash.tabs.overview'), icon: BarChart3 },
    { key: 'soil', label: t('farmerDash.tabs.soil'), icon: Leaf },
    { key: 'pest', label: t('farmerDash.tabs.pest'), icon: Bug },
    { key: 'drone', label: t('farmerDash.tabs.drone'), icon: Plane },
    { key: 'market', label: t('farmerDash.tabs.market'), icon: ShoppingCart },
    { key: 'transactions', label: t('farmerDash.tabs.transactions'), icon: CreditCard },
    { key: 'profile', label: t('farmerDash.tabs.profile'), icon: Settings },
  ];

  const handleProfileSave = async () => {
    if (farmerName && farmLocation) {
      try {
        const res = await fetch("http://localhost:8000/api/user/profile", {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
           },
           body: JSON.stringify({
             name: farmerName,
             location: farmLocation,
             farm_size: farmSize,
             crop_type: cropType,
             preferred_language: i18n.language
           })
        });
        if (res.ok) {
          await fetchProfile(); // refresh auth context
          setActiveTab('overview');
        }
      } catch (err) {
        console.error("Failed to save profile syncing to backend: ", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-black">
              {profileSetup ? `Namaste, ${farmerName}! 🙏` : t('farmerDash.title')}
            </h1>
            <p className="text-medium text-sm flex items-center gap-2 mt-1">
              {profileSetup ? (
                <>
                  <MapPin className="w-4 h-4 text-terracotta" />
                  {farmLocation} — {farmSize} Acres {cropType}
                </>
              ) : (
                t('farmerDash.setupProfile')
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('kisanbot:open'))}
              className="p-3 rounded-xl transition-all bg-white text-terracotta shadow-sm hover:shadow-md border border-border hover:bg-terracotta hover:text-white"
              title="Open KisanBot Voice Assistant"
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
              <Plus className="w-4 h-4" /> {t('farmerDash.newListing')}
            </Link>
          </div>
        </div>

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
                <h2 className="font-heading text-2xl font-bold text-black">{t('fd.setup.title')}</h2>
                <p className="text-medium text-sm mt-1">{t('fd.setup.subtitle')}</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.name')}</label>
                  <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} placeholder="Enter your name" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.location')}</label>
                  <input type="text" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="Village, District, State" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.size')}</label>
                    <input type="text" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 5" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.crop')}</label>
                    <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all appearance-none">
                      <option value="">{t('fd.setup.select')}</option>
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
                  <label className="block text-sm font-medium text-dark mb-2">{t('fd.setup.lang')}</label>
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
                  {t('fd.setup.save')}
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
                <h3 className="font-heading text-xl font-bold text-black mb-2">{t('fd.overview.welcomeTitle')}</h3>
                <p className="text-medium text-sm mb-4 max-w-md mx-auto">{t('fd.overview.welcomeSubtitle')}</p>
                <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors shadow-md">
                  {t('fd.overview.welcomeBtn')}
                </button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t('fd.stats.yield'), value: profileSetup ? '—' : t('fd.stats.setup'), icon: TrendingUp, bg: 'bg-sage/10', color: 'text-sage' },
                { label: t('fd.stats.price'), value: profileSetup ? '—' : 'Setup required', icon: BarChart3, bg: 'bg-amber/10', color: 'text-amber' },
                { label: t('fd.stats.pest'), value: profileSetup ? 'Low' : '—', icon: Bug, bg: 'bg-terracotta/10', color: 'text-terracotta' },
                { label: t('fd.stats.soil'), value: profileSetup ? '—' : t('fd.stats.connect'), icon: Leaf, bg: 'bg-info/10', color: 'text-info' },
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

            {/* Weather + AgriMetrics + Alerts */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber" /> {t('fd.weather.title')}
                  </h3>
                  <span className="text-xs font-semibold text-muted bg-offwhite px-2 py-1 flex items-center gap-1 rounded-md"><MapPin className="w-3 h-3 text-terracotta"/> {locationName}</span>
                </div>
                
                {weatherLoading ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted relative z-10">
                    <div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Connecting to meteorology satellites...</p>
                  </div>
                ) : weatherData ? (
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-4xl font-heading font-bold text-black">{Math.round(weatherData.current_weather.temperature)}°C</p>
                        <p className="text-sm text-medium text-muted capitalize mt-1">
                          {weatherData.current_weather.weathercode <= 3 ? 'Clear / Sunny' : 'Cloudy / Rain'}
                        </p>
                      </div>
                      <Sun className="w-14 h-14 text-amber animate-pulse-slow drop-shadow-md" />
                    </div>

                    <div className="flex justify-between border-t border-border pt-4">
                      {weatherData.daily?.time?.slice(0, 5).map((timeStr: string, i: number) => {
                        const date = new Date(timeStr);
                        const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[i]);
                        const rainProb = Math.round(weatherData.daily.precipitation_probability_max[i] || 0);

                        return (
                          <div key={i} className={`text-center p-2 rounded-xl transition-all ${i === 0 ? 'bg-amber/10 shadow-inner' : 'hover:bg-offwhite'}`}>
                            <p className="text-xs text-muted mb-2 font-medium">{dayName}</p>
                            {rainProb > 40 ? (
                              <Droplets className="w-5 h-5 mx-auto mb-2 text-info" />
                            ) : (
                              <Sun className="w-5 h-5 mx-auto mb-2 text-amber" />
                            )}
                            <p className="text-sm font-bold text-black">{maxTemp}°</p>
                            <p className="text-[10px] text-info font-semibold">{rainProb}% rain</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted p-4">Failed to load weather data</div>
                )}
              </div>

              {/* Agri-Metrics Dashboard */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                <h3 className="font-heading text-lg font-semibold text-black mb-6 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-sage" /> Agri-Metrics (Live)
                </h3>
                {weatherLoading ? (
                   <div className="flex flex-col items-center justify-center h-28 text-muted">
                    <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin mb-2"></div>
                  </div>
                ) : agriData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-sage/5 rounded-xl border border-sage/20 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-dark flex items-center gap-2"><Droplets className="w-4 h-4 text-info"/> Topsoil Moisture</span>
                        <span className="text-lg font-bold text-sage">{Math.round(agriData.soilMoisture * 100)}%</span>
                      </div>
                      <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-border">
                        <div className="bg-gradient-to-r from-info to-sage h-full transition-all duration-1000" style={{ width: `${Math.round(agriData.soilMoisture * 100)}%` }}></div>
                      </div>
                      <p className="text-xs text-muted mt-2 font-medium">Optimal 0-1cm depth moisture mapping.</p>
                    </div>

                    <div className="p-4 bg-terracotta/5 rounded-xl border border-terracotta/20 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-dark flex items-center gap-2"><Sun className="w-4 h-4 text-terracotta"/> Evapotranspiration</span>
                        <span className="text-lg font-bold text-terracotta">{agriData.et0} <span className="text-xs font-normal">mm/day</span></span>
                      </div>
                       <p className="text-xs text-muted mt-1 leading-relaxed">Estimated water lost to evaporation. Plan irrigation accordingly.</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                    <Bug className="w-5 h-5 text-terracotta" /> {t('fd.pestAlert.title')}
                  </h3>
                  <button onClick={() => setActiveTab('pest')} className="text-terracotta text-sm font-medium hover:underline flex items-center gap-1">
                    {t('fd.pestAlert.view')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {profileSetup ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-offwhite rounded-xl text-center text-muted text-sm">{t('fd.pestAlert.noActive')}</div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-offwhite/50 rounded-xl border border-dashed border-border mt-6">
                    <Bug className="w-10 h-10 text-muted/50 mx-auto mb-3" />
                    <p className="text-muted text-sm font-medium">{t('fd.pestAlert.noProfile')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Listings */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                  <Package className="w-5 h-5 text-sage" /> {t('fd.listings.title')}
                </h3>
                <Link to="/marketplace" className="text-terracotta text-sm font-medium hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> {t('fd.listings.new')}
                </Link>
              </div>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                <Package className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('fd.listings.none')}</h4>
                <p className="text-muted text-sm mb-4">{t('fd.listings.desc')}</p>
                <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                  <Plus className="w-4 h-4" /> {t('fd.listings.create')}
                </Link>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-clay" /> {t('fd.transact.recent')}
              </h3>
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">{t('fd.transact.none')}</p>
              </div>
            </div>
          </div>
        )}

        {/* SOIL TAB */}
        {activeTab === 'soil' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-6">{t('fd.soil.title')}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { label: t('fd.soil.ph'), icon: Leaf, placeholder: t('fd.soil.notMeasured'), status: 'pending' },
                  { label: t('fd.soil.n'), icon: Leaf, placeholder: t('fd.soil.connect'), status: 'pending' },
                  { label: t('fd.soil.p'), icon: AlertTriangle, placeholder: 'Connect sensor', status: 'pending' },
                  { label: t('fd.soil.k'), icon: Leaf, placeholder: 'Connect sensor', status: 'pending' },
                  { label: t('fd.soil.moisture'), icon: Droplets, placeholder: 'Connect sensor', status: 'pending' },
                  { label: t('fd.soil.temp'), icon: Thermometer, placeholder: 'Connect sensor', status: 'pending' },
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
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('fd.soil.connectTitle')}</h4>
                <p className="text-medium text-sm mb-4">{t('fd.soil.connectDesc')}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                    {t('fd.soil.btnPair')}
                  </button>
                  <button className="px-6 py-3 bg-white text-terracotta border-2 border-terracotta rounded-xl font-semibold hover:bg-terracotta/5 transition-colors">
                    {t('fd.soil.btnUpload')}
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
                <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('fd.pest.scanTrap')}</h3>
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-terracotta hover:bg-terracotta/5 transition-all cursor-pointer">
                  <Bug className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-dark font-medium mb-2">{t('fd.pest.uploadTrap')}</p>
                  <p className="text-sm text-muted mb-4">{t('fd.pest.descTrap')}</p>
                  <button className="px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                    {t('fd.pest.btnCamera')}
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('fd.pest.scanLeaf')}</h3>
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-sage hover:bg-sage/5 transition-all cursor-pointer">
                  <Leaf className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-dark font-medium mb-2">{t('fd.pest.uploadLeaf')}</p>
                  <p className="text-sm text-muted mb-4">{t('fd.pest.descLeaf')}</p>
                  <button className="px-6 py-3 bg-sage text-white rounded-xl font-semibold hover:bg-sage-dark transition-colors">
                    {t('fd.pest.btnCamera')}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('fd.pest.history')}</h3>
              <div className="p-8 text-center">
                <Bug className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">{t('fd.pest.historyDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* DRONE TAB */}
        {activeTab === 'drone' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-6">{t('fd.drone.title')}</h3>
              <div className="bg-offwhite rounded-xl p-6 text-center">
                <img src="https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80" alt="Drone" className="w-full h-48 object-cover rounded-xl mb-6" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('fd.drone.none')}</h4>
                <p className="text-medium text-sm mb-6 max-w-md mx-auto">{t('fd.drone.desc')}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button className="px-6 py-3 bg-info text-white rounded-xl font-semibold hover:bg-info/90 transition-colors flex items-center justify-center gap-2">
                    <Plane className="w-5 h-5" /> {t('fd.drone.btnPair')}
                  </button>
                  <button className="px-6 py-3 bg-white text-info border-2 border-info rounded-xl font-semibold hover:bg-info/5 transition-colors">
                    {t('fd.drone.btnBook')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MARKET TAB */}
        {activeTab === 'market' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('fd.market.title')}</h3>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('fd.market.start')}</h4>
                <p className="text-muted text-sm mb-4 max-w-md mx-auto">{t('fd.market.desc')}</p>
                <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors">
                  <Plus className="w-4 h-4" /> Create Listing
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('fd.market.trends')}</h3>
              <p className="text-muted text-sm mb-4">{t('fd.market.trendsDesc')}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Wheat', 'Rice', 'Mustard', 'Soybean'].map((crop) => (
                  <button key={crop} className="p-4 bg-offwhite border border-border rounded-xl text-center hover:border-terracotta hover:bg-terracotta/5 transition-all">
                    <p className="text-sm font-semibold text-black">{crop}</p>
                    <p className="text-xs text-muted mt-1">{t('fd.market.viewPrices')}</p>
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
                <p className="text-sm text-muted">{t('fd.transactTab.earnings')}</p>
                <p className="font-heading text-3xl font-bold text-black mt-2">₹0</p>
                <p className="text-xs text-muted mt-1">{t('fd.transactTab.season')}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                <p className="text-sm text-muted">{t('fd.transactTab.score')}</p>
                <p className="font-heading text-3xl font-bold text-amber mt-2">—</p>
                <p className="text-xs text-muted mt-1">{t('fd.transactTab.scoreDesc')}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                <p className="text-sm text-muted">{t('fd.transactTab.orders')}</p>
                <p className="font-heading text-3xl font-bold text-black mt-2">0</p>
                <p className="text-xs text-muted mt-1">{t('fd.transactTab.disputes')}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('fd.transactTab.history')}</h3>
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">{t('fd.transactTab.none')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
