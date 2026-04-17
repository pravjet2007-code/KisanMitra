import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Sprout, Bug, TrendingUp, Shield, ChevronRight,
  Leaf, BarChart3, Users, ShoppingCart,
  ArrowRight, CheckCircle2, Globe, Smartphone,
  Mic, Play, ChevronDown, Wheat, ScanLine, Lock,
  CircleDollarSign, FileCheck, Target, Truck, BookOpen, Microscope
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HERO_IMG = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80';
const FARM_IMG = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80';
const HARVEST_IMG = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80';

const stats = [
  { value: '50K+', labelKey: 'home.stats.farmers', icon: Users },
  { value: '5,000+', labelKey: 'home.stats.buyers', icon: ShoppingCart },
  { value: '₹500 Cr', labelKey: 'home.stats.gmv', icon: CircleDollarSign },
  { value: '08', labelKey: 'home.stats.languages', icon: Globe },
];

const modulesData = [
  {
    id: 'soil',
    icon: Leaf,
    title: 'Soil Health & Fertilizer Advisor',
    desc: 'IoT sensors measure pH, NPK, moisture & temperature. Get plot-wise nutrient recommendations and order inputs directly.',
    metrics: ['25% less fertilizer waste', 'Plot-wise nutrient maps', 'Direct input ordering'],
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    accent: 'from-sage to-sage-light',
  },
  {
    id: 'pest',
    icon: Bug,
    title: 'Pest & Disease Monitoring',
    desc: 'Phone-based AI scans pheromone traps. Get outbreak predictions and eco-friendly treatment plans.',
    metrics: ['80%+ classification accuracy', 'Community outbreak alerts', 'Treatment guidance'],
    img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80',
    accent: 'from-terracotta to-terracotta-light',
  },
  {
    id: 'disease',
    icon: Microscope,
    title: 'Plant Disease Detection',
    desc: 'Upload leaf photos using your phone camera. On-device AI identifies plant diseases, analyzes severity, and predicts spread risk using environmental and regional data.',
    metrics: ['80%+ classification accuracy', 'Instant photo diagnosis', 'Treatment guidance'],
    img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80',
    accent: 'from-terracotta to-terracotta-light',
  },
  {
    id: 'schemes',
    icon: BookOpen,
    title: 'Government Schemes Finder',
    desc: "Discover all central and state government schemes you're eligible for — PM Kisan, KCC, crop insurance, fertilizer subsidies, and more. Apply directly from the app.",
    metrics: ['50+ schemes covered', 'Eligibility checker', 'Direct application links'],
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    accent: 'from-emerald-500 to-green-600',
  },
  {
    id: 'yield',
    icon: TrendingUp,
    title: 'Yield Prediction & Marketplace',
    desc: 'AI combines soil + pest + weather data to forecast yields and market prices. Connect directly with buyers.',
    metrics: ['15-20% MAPE accuracy', 'Real-time price forecasts', 'Direct buyer connections'],
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    accent: 'from-amber to-amber-light',
  },
  {
    id: 'secure',
    icon: Shield,
    title: 'Secure Transactions & Farmer Score',
    desc: 'Digital contracts with escrow payments, quality verification, and reputation scoring for better credit access.',
    metrics: ['98% payment success', '<5 min UPI payout', '<2% dispute rate'],
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    accent: 'from-clay to-earth',
  },
];

const howItWorksData = [
  {
    step: '01',
    icon: Smartphone,
    img: FARM_IMG,
    title: 'Set Up Your Farm Profile',
    desc: 'Register your farm, connect IoT soil sensors, and set your crop preferences in minutes.',
  },
  {
    step: '02',
    icon: BookOpen,
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    title: 'Get AI-Driven Insights',
    desc: 'Receive real-time recommendations on soil health, pest control, and government schemes tailored to your farm.',
  },
  {
    step: '03',
    icon: ShoppingCart,
    img: HARVEST_IMG,
    title: 'Sell at the Best Price',
    desc: 'List your produce, connect with verified buyers, and receive instant UPI payments with escrow protection.',
  },
];

const journeyStepsData = [
  {
    phase: 'Pre-Sowing',
    desc: 'Install soil sensors → view pH/NPK report → buy recommended fertilizer through marketplace.',
    icon: Leaf,
    color: 'bg-sage',
  },
  {
    phase: 'Emergence',
    desc: 'Scan pheromone traps weekly → receive outbreak alerts → apply recommended treatments.',
    icon: Bug,
    color: 'bg-terracotta',
  },
  {
    phase: 'Mid-Season',
    desc: 'Check eligible government schemes → apply for PM Kisan, KCC or crop insurance → get subsidy directly in bank account.',
    icon: BookOpen,
    color: 'bg-emerald-600',
  },
  {
    phase: 'Pre-Harvest',
    desc: 'View yield estimate + price forecast → compare buyers → list crop at best price.',
    icon: TrendingUp,
    color: 'bg-amber',
  },
  {
    phase: 'Sale',
    desc: 'Accept best offer → escrow contract created → pickup scheduled → quality verified → instant UPI payout.',
    icon: Shield,
    color: 'bg-clay',
  },
];

const buyerFeaturesData = [
  {
    icon: BarChart3,
    title: 'Supply Forecast Dashboard',
    desc: 'Regional yield predictions 4–6 weeks before harvest.',
  },
  {
    icon: FileCheck,
    title: 'Verified Quality Data',
    desc: 'Soil history, drone maps, pest records, and Farmer Score.',
  },
  {
    icon: ScanLine,
    title: 'Digital Quality Checks',
    desc: 'Moisture, grade, foreign matter with photo evidence.',
  },
  {
    icon: Target,
    title: 'Full Lot Traceability',
    desc: 'Farm-to-buyer passport for compliance & export readiness.',
  },
  {
    icon: Lock,
    title: 'Secure Escrow Payments',
    desc: 'Funds held until quality confirmed. Automated release.',
  },
  {
    icon: Truck,
    title: 'Logistics Integration',
    desc: 'Schedule pickups, track shipments, verification codes.',
  },
];

const flywheelData = [
  {
    icon: Leaf,
    accent: 'text-sage-light',
    title: 'Season Data Collected',
    desc: 'Soil, pest, weather, and yield data is captured every season across all farms.',
  },
  {
    icon: BookOpen,
    accent: 'text-emerald-400',
    title: 'Scheme Matching Improves',
    desc: 'More farmer profiles mean better eligibility matching for government schemes.',
  },
  {
    icon: TrendingUp,
    accent: 'text-terracotta-light',
    title: 'Predictions Get Smarter',
    desc: 'AI models retrain each cycle — yield and price forecasts become more accurate.',
  },
  {
    icon: Users,
    accent: 'text-amber-light',
    title: 'Adoption Grows',
    desc: 'Better outcomes attract more farmers and buyers, strengthening the network.',
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

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
              <span className="text-white/80 text-sm font-medium">{t('home.heroBadge', 'IoT + AI + Marketplace for Indian Agriculture')}</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6">
              {t('home.heroTitle', {
                saathi: t('home.heroSaathi', 'Saathi'),
                inField: t('home.heroInField', 'in the Field')
              }).split(t('home.heroSaathi', 'Saathi')).map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="relative inline-block">
                      <span className="text-terracotta-light">{t('home.heroSaathi', 'Saathi')}</span>
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                        <path d="M2 6C50 2 150 2 198 6" stroke="#E08B5A" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </span>
              ))}
            </h1>

            <p className="text-white/60 text-lg lg:text-xl max-w-xl mb-10 leading-relaxed">
              {t('home.heroDesc', 'From soil testing to selling produce — empowering Indian farmers with precision farming, AI insights, and a secure marketplace.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-heading font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-lg hover:shadow-xl text-base"
              >
                <Wheat className="w-5 h-5" />
                {t('home.joinFarmer', 'Join as Farmer')}
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-heading font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm"
              >
                {t('home.joinBuyer', 'Join as Buyer')}
              </Link>
              <button
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/70 font-medium hover:text-white transition-colors text-base"
              >
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
                {t('home.watchDemo', 'Watch Demo')}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-terracotta-light" />
                <span>{t('home.voiceSupported', 'Voice Supported')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-terracotta-light" />
                <span>{t('home.languages', '08 Languages')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-terracotta-light" />
                <span>{t('home.securePayments', 'Secure Payments')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-gentle">
          <span className="text-white/25 text-xs font-medium tracking-widest uppercase">{t('home.scroll', 'Scroll')}</span>
          <ChevronDown className="w-5 h-5 text-white/25" />
        </div>
      </section>

      {/* ========== 6 MODULES ========== */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber/10 text-amber text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              {t('home.sixModules', '6 Powerful Modules')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
              {t('home.platformTitle', 'Complete Farm-to-Market Platform')}
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              {t('home.platformSubtitle', 'Each module strengthens the others — creating a data flywheel that improves every season.')}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Tab buttons */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {modulesData.map((mod, i) => (
                <button
                  key={mod.id}
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
                    src={modulesData[activeModule].img}
                    alt={modulesData[activeModule].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      {modulesData[activeModule].title}
                    </h3>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <p className="text-medium leading-relaxed text-base mb-6">
                    {modulesData[activeModule].desc}
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {modulesData[activeModule].metrics.map((metric, i) => (
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
                    {t('home.exploreModule', 'Explore Module')} <ArrowRight className="w-4 h-4" />
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
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-terracotta-light/20 text-terracotta-light text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              {t('home.advantage', 'Our Advantage')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
              {t('home.flywheelTitle', 'The Data Flywheel Effect')}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              {t('home.flywheelSubtitle', 'Each season of data makes the entire platform smarter for everyone.')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {flywheelData.map((item, i) => (
              <div key={i} className="glass-dark border border-white/10 rounded-2xl p-6 md:p-7 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className={`w-6 h-6 ${item.accent}`} />
                </div>
                <h4 className="font-heading text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                {i < flywheelData.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-white/20 mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FARMER JOURNEY ========== */}
      <section className="bg-offwhite py-20 md:py-28 bg-pattern-dots">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="inline-block px-4 py-1.5 bg-sage/10 text-sage text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
                {t('home.seasonalCompanion', 'Seasonal Companion')}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-black mb-5">
                {t('home.journeyTitle', 'A Full Season Journey — With You')}
              </h2>
              <p className="text-medium text-lg mb-10 leading-relaxed">
                {t('home.journeySubtitle', 'KISAN MITRA guides farmers through every phase of the crop cycle, from sowing decisions to post-harvest sales.')}
              </p>
              <div className="space-y-1">
                {journeyStepsData.map((phase, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-11 h-11 rounded-xl ${phase.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                        <phase.icon className="w-5 h-5 text-white" />
                      </div>
                      {i < journeyStepsData.length - 1 && (
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

            {/* CTA card */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img src={HARVEST_IMG} alt="Harvest" className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  {t('home.readyToTransform', 'Ready to Transform Your Farm?')}
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  {t('home.transformDesc', 'Set up your profile, connect sensors, and start getting AI-driven recommendations today.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-terracotta text-white font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-lg"
                  >
                    {t('home.startJourney', 'Start Your Journey')} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm"
                  >
                    {t('home.learnMore', 'Learn More')}
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
              {t('home.buyerSection.badge', 'For Buyers & Procurement Teams')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
              {t('home.buyerSection.title', 'Procurement Intelligence, Not Just Trading')}
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              {t('home.buyerSection.subtitle', 'Predictive supply insights, verified quality data, and full traceability.')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {buyerFeaturesData.map((feat, i) => (
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
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-info text-white font-bold rounded-xl hover:bg-info/90 transition-colors shadow-lg text-base"
            >
              {t('home.buyerSection.exploreBtn', 'Explore Buyer Dashboard')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-[800px] mx-auto px-4 md:px-8 text-center">
          <Sprout className="w-12 h-12 text-terracotta-light mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            {t('home.readyToTransformTitle', 'Ready to Transform Agriculture?')}
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            {t('home.readyToTransformSubtitle', 'Join thousands of farmers and buyers already using KISAN MITRA to grow better, sell smarter, and build trust.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-xl text-lg"
            >
              {t('home.getStartedFree', 'Get Started Free')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-lg backdrop-blur-sm"
            >
              {t('home.exploreFeatures', 'Explore Features')}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== VIDEO MODAL ========== */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-terracotta" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-black mb-2">
              {t('home.demoSoon', 'Demo Coming Soon')}
            </h3>
            <p className="text-medium mb-6">
              {t('home.demoDesc', 'Our platform walkthrough is being prepared.')}
            </p>
            <button
              onClick={() => setShowVideo(false)}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-dark transition-colors"
            >
              {t('home.close', 'Close')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}