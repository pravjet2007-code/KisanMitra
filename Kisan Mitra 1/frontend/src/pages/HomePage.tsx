import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sprout, Bug, Plane, TrendingUp, Shield, ChevronRight,
  Leaf, BarChart3, Users, ShoppingCart,
  ArrowRight, CheckCircle2, Zap, Globe, Smartphone,
  Mic, Play, ChevronDown, Wheat, ScanLine, Lock,
  CircleDollarSign, FileCheck, Target, Truck
} from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80';
const FARM_IMG = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80';
const DRONE_IMG = 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80';
const HARVEST_IMG = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80';





export default function HomePage() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const stats = [
    { value: '50K+', label: t('home.stats.farmers'), icon: Users },
    { value: '5,000+', label: t('home.stats.buyers'), icon: ShoppingCart },
    { value: '₹500 Cr', label: t('home.stats.gmv'), icon: CircleDollarSign },
    { value: '08', label: t('home.stats.languages'), icon: Globe },
  ];

  const modules = [
    {
      icon: Leaf,
      title: t('home.modules.soil.title'),
      desc: t('home.modules.soil.desc'),
      metrics: [t('home.modules.soil.m1'), t('home.modules.soil.m2'), t('home.modules.soil.m3')],
      img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
      accent: 'from-sage to-sage-light',
    },
    {
      icon: Bug,
      title: t('home.modules.pest.title'),
      desc: t('home.modules.pest.desc'),
      metrics: [t('home.modules.pest.m1'), t('home.modules.pest.m2'), t('home.modules.pest.m3')],
      img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=600&q=80',
      accent: 'from-terracotta to-terracotta-light',
    },
    {
      icon: Plane,
      title: t('home.modules.drone.title'),
      desc: t('home.modules.drone.desc'),
      metrics: [t('home.modules.drone.m1'), t('home.modules.drone.m2'), t('home.modules.drone.m3')],
      img: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80',
      accent: 'from-info to-sky-500',
    },
    {
      icon: TrendingUp,
      title: t('home.modules.yield.title'),
      desc: t('home.modules.yield.desc'),
      metrics: [t('home.modules.yield.m1'), t('home.modules.yield.m2'), t('home.modules.yield.m3')],
      img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
      accent: 'from-amber to-amber-light',
    },
    {
      icon: Shield,
      title: t('home.modules.secure.title'),
      desc: t('home.modules.secure.desc'),
      metrics: [t('home.modules.secure.m1'), t('home.modules.secure.m2'), t('home.modules.secure.m3')],
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
      accent: 'from-clay to-earth',
    },
  ];

  const howItWorks = [
    { step: '01', title: t('home.how.1.title'), desc: t('home.how.1.desc'), icon: Smartphone, img: FARM_IMG },
    { step: '02', title: t('home.how.2.title'), desc: t('home.how.2.desc'), icon: Zap, img: DRONE_IMG },
    { step: '03', title: t('home.how.3.title'), desc: t('home.how.3.desc'), icon: ShoppingCart, img: HARVEST_IMG },
  ];

  const journeySteps = [
    { phase: 'Pre-Sowing', desc: 'Install soil sensors → view pH/NPK report → buy recommended fertilizer through marketplace.', icon: Leaf, color: 'bg-sage' },
    { phase: 'Emergence', desc: 'Scan pheromone traps weekly → receive outbreak alerts → apply recommended treatments.', icon: Bug, color: 'bg-terracotta' },
    { phase: 'Mid-Season', desc: 'Launch drone scan → get health maps → locate disease zones → target interventions.', icon: Plane, color: 'bg-info' },
    { phase: 'Pre-Harvest', desc: 'View yield estimate + price forecast → compare buyers → list crop at best price.', icon: TrendingUp, color: 'bg-amber' },
    { phase: 'Sale', desc: 'Accept best offer → escrow contract created → pickup scheduled → quality verified → instant UPI payout.', icon: Shield, color: 'bg-clay' },
  ];

  const buyerFeatures = [
    { icon: BarChart3, title: 'Supply Forecast Dashboard', desc: 'Regional yield predictions 4–6 weeks before harvest.' },
    { icon: FileCheck, title: 'Verified Quality Data', desc: 'Soil history, drone maps, pest records, and Farmer Score.' },
    { icon: ScanLine, title: 'Digital Quality Checks', desc: 'Moisture, grade, foreign matter with photo evidence.' },
    { icon: Target, title: 'Full Lot Traceability', desc: 'Farm-to-buyer passport for compliance & export readiness.' },
    { icon: Lock, title: 'Secure Escrow Payments', desc: 'Funds held until quality confirmed. Automated release.' },
    { icon: Truck, title: 'Logistics Integration', desc: 'Schedule pickups, track shipments, verification codes.' },
  ];

  const competitors = [
    { name: 'eNAM', soil: false, pest: false, drone: false, quality: 'Physical', escrow: false, score: false },
    { name: 'DeHaat', soil: true, pest: true, drone: false, quality: 'Aggregator', escrow: false, score: false },
    { name: 'AgriBazaar', soil: false, pest: false, drone: false, quality: 'Warehouse', escrow: true, score: false },
    { name: 'KISAN MITRA', soil: true, pest: true, drone: true, quality: 'Digital', escrow: true, score: true },
  ];

  return (
    <div className="overflow-hidden">
      {/* ========== HERO ========== */}
      <section className="relative min-h-[100svh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Indian farmland" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-32 w-full">
          <div className="max-w-2xl animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full mb-8 backdrop-blur-sm">
              <Sprout className="w-4 h-4 text-terracotta-light" />
              <span className="text-white/80 text-sm font-medium">IoT + AI + Marketplace for Indian Agriculture</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6">
              {t('home.heroTitle1')}{' '}
              <span className="relative inline-block">
                <span className="text-terracotta-light">{t('home.heroTitle2').replace('.', '')}</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="#E08B5A" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-white/60 text-lg lg:text-xl max-w-xl mb-10 leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/farmer-dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-heading font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-lg hover:shadow-xl text-base"
              >
                <Wheat className="w-5 h-5" />
                {t('home.startFarming')}
              </Link>
              <Link
                to="/buyer-dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-heading font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm"
              >
                {t('home.joinBuyer')}
              </Link>
              <button
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/70 font-medium hover:text-white transition-colors text-base"
              >
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
                {t('home.watchDemo')}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-terracotta-light" />
                <span>{t('home.voiceSupported')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-terracotta-light" />
                <span>{t('home.languages')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-terracotta-light" />
                <span>{t('home.securePayments')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-gentle">
          <span className="text-white/25 text-xs font-medium tracking-widest uppercase">{t('home.scroll')}</span>
          <ChevronDown className="w-5 h-5 text-white/25" />
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="bg-white border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-14 h-14 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terracotta group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-terracotta group-hover:text-white transition-colors" />
                </div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-black">{stat.value}</p>
                <p className="text-medium text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="bg-offwhite py-20 md:py-28 bg-pattern-dots">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              {t('home.threeStep')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
              {t('home.howItWorksTitle')}
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              {t('home.howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-border">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-terracotta text-white text-sm font-bold rounded-xl flex items-center justify-center shadow-md">
                    {item.step}
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-black mb-3">{item.title}</h3>
                  <p className="text-medium text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 5 MODULES ========== */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber/10 text-amber text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              {t('home.fiveModules')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
              {t('home.platformTitle')}
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              {t('home.platformSubtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Tab buttons */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {modules.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModule(i)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all whitespace-nowrap lg:whitespace-normal min-w-[200px] lg:min-w-0 border ${
                    activeModule === i
                      ? 'bg-white border-terracotta/30 shadow-md'
                      : 'bg-light border-transparent hover:border-border hover:bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeModule === i ? 'bg-terracotta text-white' : 'bg-terracotta/10 text-terracotta'
                  }`}>
                    <mod.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold ${activeModule === i ? 'text-black' : 'text-dark'}`}>
                    {mod.title}
                  </span>
                  {activeModule === i && (
                    <ChevronRight className="w-4 h-4 text-terracotta ml-auto hidden lg:block" />
                  )}
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm animate-fade-in">
                <div className="relative h-48 sm:h-56">
                  <img
                    src={modules[activeModule].img}
                    alt={modules[activeModule].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      {modules[activeModule].title}
                    </h3>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <p className="text-medium leading-relaxed text-base mb-6">
                    {modules[activeModule].desc}
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {modules[activeModule].metrics.map((metric, i) => (
                      <div key={i} className="bg-offwhite rounded-xl p-4 border border-border">
                        <CheckCircle2 className="w-5 h-5 text-sage mb-2" />
                        <p className="text-sm font-semibold text-black">{metric}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-terracotta text-white rounded-xl font-semibold hover:bg-terracotta-dark transition-colors shadow-md"
                  >
                    {t('home.exploreModule')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DATA FLYWHEEL ========== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-terracotta-light/20 text-terracotta-light text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              Our Advantage
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
              {t('home.flywheelTitle')}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              {t('home.flywheelSubtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Leaf, title: 'Farm Data', desc: 'Soil + pest + drone data improves yield & quality predictions', accent: 'text-sage-light' },
              { icon: TrendingUp, title: 'Better Predictions', desc: 'Accurate forecasts drive fair pricing and buyer confidence', accent: 'text-terracotta-light' },
              { icon: ShoppingCart, title: 'Better Outcomes', desc: 'Higher farmer income and lower buyer procurement costs', accent: 'text-amber-light' },
              { icon: Users, title: 'More Adoption', desc: 'More users → more data → smarter AI next season', accent: 'text-info' },
            ].map((item, i) => (
              <div key={i} className="glass-dark border border-white/10 rounded-2xl p-6 md:p-7 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className={`w-6 h-6 ${item.accent}`} />
                </div>
                <h4 className="font-heading text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                {i < 3 && <ArrowRight className="w-5 h-5 text-white/20 mt-4 hidden lg:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FARMER JOURNEY (Generic — no hardcoded Ravi) ========== */}
      <section className="bg-offwhite py-20 md:py-28 bg-pattern-dots">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="inline-block px-4 py-1.5 bg-sage/10 text-sage text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
                Seasonal Companion
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-black mb-5">
                A Full Season Journey — With You
              </h2>
              <p className="text-medium text-lg mb-10 leading-relaxed">
                KISAN MITRA guides farmers through every phase of the crop cycle, from sowing decisions to post-harvest sales.
              </p>
              <div className="space-y-1">
                {journeySteps.map((phase, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-11 h-11 rounded-xl ${phase.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                        <phase.icon className="w-5 h-5 text-white" />
                      </div>
                      {i < journeySteps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-2 min-h-[24px]" />
                      )}
                    </div>
                    <div className="pb-8">
                      <h4 className="font-heading font-bold text-black text-base mb-1">{phase.phase}</h4>
                      <p className="text-medium text-sm leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card — no hardcoded data */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img src={HARVEST_IMG} alt="Harvest" className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Ready to Transform Your Farm?
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  Set up your profile, connect sensors, and start getting AI-driven recommendations today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/farmer-dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-terracotta text-white font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-lg"
                  >
                    Start Your Journey <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BUYER SECTION ========== */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-info/10 text-info text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              For Buyers & Procurement Teams
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
              Procurement Intelligence,{' '}
              <span className="text-gradient-warm">Not Just Trading</span>
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              Predictive supply insights, verified quality data, and full traceability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {buyerFeatures.map((feat, i) => (
              <div key={i} className="bg-offwhite border border-border rounded-2xl p-6 md:p-7 card-hover group">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-info group-hover:scale-110 transition-all duration-300">
                  <feat.icon className="w-6 h-6 text-info group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-lg font-bold text-black mb-2">{feat.title}</h3>
                <p className="text-medium text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/buyer-dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-info text-white font-bold rounded-xl hover:bg-info/90 transition-colors shadow-lg text-base"
            >
              Explore Buyer Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== COMPETITIVE TABLE ========== */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              Why KISAN MITRA
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
              The Only End-to-End Platform
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              Compare our capabilities with existing solutions.
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full bg-white rounded-2xl shadow-sm border border-border overflow-hidden min-w-[640px]">
              <thead>
                <tr className="bg-light border-b border-border">
                  <th className="text-left px-5 py-4 text-xs font-bold text-dark uppercase tracking-wider">Feature</th>
                  {competitors.map((c) => (
                    <th key={c.name} className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-center ${c.name === 'KISAN MITRA' ? 'text-terracotta bg-terracotta/5' : 'text-dark'}`}>
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-light">
                {[
                  { label: 'AI Soil Advisory', key: 'soil' },
                  { label: 'Pest/Disease AI', key: 'pest' },
                  { label: 'Drone Integration', key: 'drone' },
                  { label: 'Quality Verification', key: 'quality' },
                  { label: 'Escrow Payments', key: 'escrow' },
                  { label: 'Farmer Credit Score', key: 'score' },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-light/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-semibold text-black">{row.label}</td>
                    {competitors.map((c) => {
                      const val = c[row.key as keyof typeof c];
                      return (
                        <td key={c.name} className={`px-5 py-4 text-center ${c.name === 'KISAN MITRA' ? 'bg-terracotta/5' : ''}`}>
                          {typeof val === 'boolean' ? (
                            val ? <CheckCircle2 className="w-5 h-5 text-sage mx-auto" /> : <XMark className="w-5 h-5 text-muted mx-auto" />
                          ) : (
                            <span className={`text-sm font-semibold ${c.name === 'KISAN MITRA' ? 'text-terracotta' : 'text-dark'}`}>{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-[800px] mx-auto px-4 md:px-8 text-center">
          <Sprout className="w-12 h-12 text-terracotta-light mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of farmers and buyers already using KISAN MITRA to grow better, sell smarter, and build trust.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/farmer-dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-xl text-lg"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-lg backdrop-blur-sm"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* ========== VIDEO MODAL ========== */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowVideo(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-terracotta" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-black mb-2">Demo Coming Soon</h3>
            <p className="text-medium mb-6">Our platform walkthrough is being prepared.</p>
            <button
              onClick={() => setShowVideo(false)}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function XMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
