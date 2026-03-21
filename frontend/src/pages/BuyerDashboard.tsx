import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, MapPin, Bell,
  ShoppingCart, FileText, Search, ChevronRight, CheckCircle2,
  Building2, Package,
  Truck, User, Upload
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Tab = 'overview' | 'forecast' | 'listings' | 'orders' | 'analytics' | 'traceability' | 'profile';

export default function BuyerDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [profileSetup, setProfileSetup] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [cropPrefs, setCropPrefs] = useState('');

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: t('buyerDash.tabs.overview'), icon: BarChart3 },
    { key: 'forecast', label: t('buyerDash.tabs.forecast'), icon: TrendingUp },
    { key: 'listings', label: t('buyerDash.tabs.listings'), icon: ShoppingCart },
    { key: 'orders', label: t('buyerDash.tabs.orders'), icon: Package },
    { key: 'analytics', label: t('buyerDash.tabs.analytics'), icon: BarChart3 },
    { key: 'traceability', label: t('buyerDash.tabs.traceability'), icon: FileText },
    { key: 'profile', label: t('buyerDash.tabs.profile'), icon: User },
  ];

  const handleProfileSave = () => {
    if (businessName && location) {
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
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-black">
                {profileSetup ? `${businessName} Dashboard` : t('buyerDash.title')}
              </h1>
              {profileSetup && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-info/10 text-info text-xs font-semibold rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-medium text-sm flex items-center gap-2">
              {profileSetup ? (
                <><Building2 className="w-4 h-4 text-info" /> {businessType} · {location} · {cropPrefs}</>
              ) : (
                t('buyerDash.setupProfile')
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-white rounded-xl shadow-xs hover:shadow-sm transition-all border border-border">
              <Bell className="w-5 h-5 text-dark" />
            </button>
            <Link
              to="/marketplace"
              className="hidden md:inline-flex items-center gap-2 px-5 py-3 bg-info text-white rounded-xl font-semibold hover:bg-info/90 transition-colors shadow-md"
            >
              <Search className="w-4 h-4" /> {t('buyerDash.findSupply')}
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
                  ? 'bg-info text-white shadow-md border-info'
                  : 'bg-white text-dark hover:bg-light shadow-xs border-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* PROFILE SETUP */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-info" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-black">{t('bd.setup.title')}</h2>
                <p className="text-medium text-sm mt-1">{t('bd.setup.subtitle')}</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('bd.setup.name')}</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Enter business name" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-info focus:ring-2 focus:ring-info/15 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('bd.setup.type')}</label>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-info focus:ring-2 focus:ring-info/15 outline-none appearance-none">
                    <option value="">{t('bd.setup.selectType')}</option>
                    <option value="{t('bd.setup.miller')}">Miller</option>
                    <option value="{t('bd.setup.trader')}">Trader</option>
                    <option value="{t('bd.setup.exporter')}">Exporter</option>
                    <option value="{t('bd.setup.coop')}">Cooperative</option>
                    <option value="{t('bd.setup.retail')}">Retailer</option>
                    <option value="{t('bd.setup.process')}">Processor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('bd.setup.location')}</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-info focus:ring-2 focus:ring-info/15 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('bd.setup.crops')}</label>
                  <input type="text" value={cropPrefs} onChange={(e) => setCropPrefs(e.target.value)} placeholder="e.g. Wheat, Rice, Grade A" className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm focus:border-info focus:ring-2 focus:ring-info/15 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">{t('bd.setup.gst')}</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-info hover:bg-info/5 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted">{t('bd.setup.uploadDst')}</p>
                  </div>
                </div>
                <button onClick={handleProfileSave} className="w-full py-4 bg-info text-white font-heading font-bold rounded-xl hover:bg-info/90 transition-all shadow-md text-base">
                  {t('bd.setup.submit')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {!profileSetup && (
              <div className="bg-gradient-to-r from-info/10 to-sage/10 border-2 border-dashed border-info/30 rounded-2xl p-6 md:p-8 text-center">
                <Building2 className="w-12 h-12 text-info mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-black mb-2">{t('bd.overview.welcomeTitle')}</h3>
                <p className="text-medium text-sm mb-4 max-w-md mx-auto">{t('bd.overview.welcomeSub')}</p>
                <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-info text-white rounded-xl font-semibold hover:bg-info/90 transition-colors shadow-md">
                  {t('bd.overview.setupBtn')}
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t('bd.stats.alerts'), value: profileSetup ? '0' : '—', icon: Bell, bg: 'bg-info/10', color: 'text-info' },
                { label: t('bd.stats.supply'), value: profileSetup ? 'Browse' : '—', icon: Package, bg: 'bg-sage/10', color: 'text-sage' },
                { label: 'Orders', value: '0', icon: Truck, bg: 'bg-terracotta/10', color: 'text-terracotta' },
                { label: t('bd.stats.savings'), value: '—', icon: TrendingUp, bg: 'bg-amber/10', color: 'text-amber' },
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

            {/* Alerts */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-info" /> {t('bd.overview.alertsTitle')}
              </h3>
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">{t('bd.overview.noAlerts')}</p>
              </div>
            </div>

            {/* Listings Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-black flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-sage" /> {t('bd.overview.listTitle')}
                </h3>
                <button onClick={() => setActiveTab('listings')} className="text-info text-sm font-medium hover:underline flex items-center gap-1">
                  {t('bd.overview.browseAll')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Link to="/marketplace" className="block p-8 text-center border-2 border-dashed border-border rounded-xl hover:border-info hover:bg-info/5 transition-all">
                <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('bd.overview.browseMarket')}</h4>
                <p className="text-muted text-sm">{t('bd.overview.marketDesc')}</p>
              </Link>
            </div>
          </div>
        )}

        {/* FORECAST */}
        {activeTab === 'forecast' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-6">{t('bd.forecast.title')}</h3>
              <div className="bg-offwhite bg-pattern-grid rounded-xl p-8 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Punjab', 'Haryana', 'Maharashtra', 'Rajasthan'].map((region) => (
                    <div key={region} className="bg-white/80 rounded-xl p-4 text-center shadow-xs border border-border">
                      <MapPin className="w-6 h-6 text-terracotta mx-auto mb-2" />
                      <p className="font-semibold text-black text-sm">{region}</p>
                      <p className="text-xs text-muted mt-1">{t('bd.forecast.loading')}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-muted text-sm text-center">{t('bd.forecast.desc')}</p>
            </div>
          </div>
        )}

        {/* BROWSE LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input type="text" placeholder="{t('bd.listings.search')}" className="w-full pl-12 pr-4 py-3 bg-offwhite rounded-xl text-sm border border-border focus:border-info focus:ring-2 focus:ring-info/15 outline-none" />
                </div>
              </div>
              <Link to="/marketplace" className="block p-8 text-center border-2 border-dashed border-border rounded-xl hover:border-info hover:bg-info/5 transition-all">
                <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('bd.listings.goTo')}</h4>
                <p className="text-muted text-sm">{t('bd.listings.desc')}</p>
              </Link>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-6">{t('bd.orders.title')}</h3>
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('bd.orders.none')}</h4>
                <p className="text-muted text-sm mb-4">{t('bd.orders.desc')}</p>
                <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-info text-white rounded-xl font-semibold hover:bg-info/90 transition-colors">
                  <Search className="w-4 h-4" /> Find Supply
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: t('bd.analytics.cost'), value: '—', desc: t('bd.analytics.track') },
                { label: t('bd.analytics.quality'), value: '—', desc: t('bd.analytics.noData') },
                { label: t('bd.analytics.dispute'), value: '0%', desc: t('bd.analytics.clean') },
                { label: t('bd.analytics.suppliers'), value: '0', desc: t('bd.analytics.tagFarmers') },
              ].map((metric, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-xs border border-border text-center">
                  <p className="text-sm text-muted">{metric.label}</p>
                  <p className="font-heading text-3xl font-bold text-black mt-2">{metric.value}</p>
                  <p className="text-xs text-muted mt-1">{metric.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-4">{t('bd.analytics.title')}</h3>
              <div className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">{t('bd.analytics.desc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* TRACEABILITY */}
        {activeTab === 'traceability' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-xl font-semibold text-black mb-2">{t('bd.trace.title')}</h3>
              <p className="text-muted text-sm mb-6">{t('bd.trace.subtitle')}</p>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                <FileText className="w-12 h-12 text-muted mx-auto mb-3" />
                <h4 className="font-heading text-lg font-semibold text-black mb-2">{t('bd.trace.none')}</h4>
                <p className="text-muted text-sm mb-4 max-w-md mx-auto">{t('bd.trace.desc')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
