import { Link } from 'react-router-dom';
import {
  Leaf, Bug, TrendingUp, Shield, Smartphone, Globe,
  Mic, CheckCircle2, ArrowRight, Sprout, Users, Lock,
  BarChart3, Truck, ScanLine, BookOpen, Microscope 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FeaturesPage() {
  const { t } = useTranslation();

  const features = [
    {
      id: 'soil',
      icon: Leaf,
      title: t('home.modules.soil.title', 'Soil Health & Fertilizer Advisor'),
      tagline: t('home.modules.soil.tagline', 'Know your soil. Feed it right.'),
      description: t('home.modules.soil.desc', 'Connect low-cost IoT sensors to measure pH, NPK, moisture, and temperature in real-time. Get plot-wise fertilizer recommendations tailored to your crop stage and soil condition.'),
      capabilities: [
        t('home.modules.soil.m1', '25% less fertilizer waste'),
        t('home.modules.soil.m2', 'Plot-wise nutrient maps'),
        t('home.modules.soil.m3', 'Direct input ordering'),
        'IoT sensor integration (BLE/LoRa/NB-IoT)',
        'Lab report upload with OCR',
        'Organic & bio-fertilizer alternatives',
      ],
      img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    },
    {
      id: 'pest',
      icon: Bug,
      title: t('home.modules.pest.title', 'Pest Monitoring'),
      tagline: t('home.modules.pest.tagline', 'Catch threats before they spread.'),
      description: t('home.modules.pest.desc', 'Use your phone camera to scan pheromone sticky trap photos. On-device AI counts and classifies insects, and predicts outbreaks using weather and community data.'),
      capabilities: [
        t('home.modules.pest.m1', '80%+ classification accuracy'),
        t('home.modules.pest.m2', 'Community outbreak alerts'),
        t('home.modules.pest.m3', 'Treatment guidance'),
        'Pheromone trap photo analysis',
        'Outbreak risk scoring & prediction',
        'Eco-friendly treatment recommendations',
      ],
      img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae',
    },
    {
      id: 'disease',
      icon: Microscope,
      title: t('home.modules.disease.title', 'Plant Disease Detection'),
      tagline: t('home.modules.disease.tagline', 'Detect diseases before they spread.'),
      description: t('home.modules.disease.desc',
      'Upload leaf photos using your phone camera. On-device AI identifies plant diseases, analyzes severity, and predicts spread risk using environmental and regional data.'
      ),
      capabilities: [
        t('home.modules.disease.m1', '80%+ classification accuracy'),
        t('home.modules.disease.m2', 'Instant photo diagnosis'),
        t('home.modules.disease.m3', 'Treatment guidance'),
        'Disease severity analysis',
        'Spread risk prediction',
        'Eco-friendly treatment recommendations',
      ],
      img:'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8',
    },
    {
      id: 'schemes',
      icon: BookOpen,
      title: t('home.modules.schemes.title', 'Government Schemes Finder'),
      tagline: t('home.how.2.tagline', 'Every scheme you deserve, found instantly.'),
      description: t('home.how.2.desc', 'Enter your profile details once and KisanMitra matches you with all eligible central and state government schemes — PM Kisan, KCC, Pradhan Mantri Fasal Bima Yojana, fertilizer subsidies, Soil Health Card, and more. Apply directly without visiting any office.'),
      capabilities: [
        '50+ central and state schemes covered',
        'Instant eligibility checker based on your profile',
        'Step-by-step application guidance',
        'PM Kisan, KCC, PMFBY, eNAM support',
        'Fertilizer & input subsidy discovery',
        'Direct application links & document checklist',
      ],
      img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    },
    {
      id: 'yield',
      icon: TrendingUp,
      title: t('home.modules.yield.title', 'Yield Prediction & Price Forecasting'),
      tagline: t('home.modules.yield.tagline', 'Plan your sale before the harvest.'),
      description: t('home.modules.yield.desc', 'AI models combine your soil, pest, weather, and regional data to forecast your plot-level yield with confidence bands. Price forecasting helps you decide when and where to sell.'),
      capabilities: [
        t('home.modules.yield.m1', '15-20% MAPE accuracy'),
        t('home.modules.yield.m2', 'Real-time price forecasts'),
        t('home.modules.yield.m3', 'Direct buyer connections'),
        'Price forecast for 1–6 weeks ahead',
        'Mandi vs buyer price comparison',
        'Net realization calculator (incl. transport)',
      ],
      img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    },
    {
      id: 'transactions',
      icon: Shield,
      title: t('home.modules.secure.title', 'Secure Transactions & Farmer Score'),
      tagline: t('home.modules.secure.tagline', 'Trust-first trading.'),
      description: t('home.modules.secure.desc', 'Every transaction is protected by digital contracts, escrow payments, and standardized quality checks. Build your Farmer Score to unlock better deals and credit access.'),
      capabilities: [
        t('home.modules.secure.m1', '98% payment success'),
        t('home.modules.secure.m2', '< 5 min UPI payout'),
        t('home.modules.secure.m3', '< 2% dispute rate'),
        'Standardized quality verification checklists',
        'Farmer Score based on performance metrics',
        '24-hour dispute resolution with mediation',
      ],
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    },
  ];

  const platformFeatures = [
    { icon: Globe, title: t('home.languages', '08 Languages'), desc: 'Full UI and content in all scheduled Indian languages.' },
    { icon: Mic, title: t('home.voiceEnabled', 'Voice Interface'), desc: 'Speak commands in your language for hands-free operation.' },
    { icon: Smartphone, title: t('features.offlineMode.title', 'Offline Mode'), desc: t('features.offlineMode.desc', 'Core features work without internet. Sync when connected.') },
    { icon: Lock, title: t('features.privacy.title', 'Data Privacy'), desc: t('features.privacy.desc', 'End-to-end encryption. You control what buyers see.') },
    { icon: ScanLine, title: t('buyerDash.tabs.traceability', 'Lot Traceability'), desc: 'Complete farm-to-buyer passport for every transaction.' },
    { icon: Truck, title: 'Logistics Integration', desc: 'Partner transport with rates, ETAs, and tracking.' },
    { icon: Users, title: t('farmerDash.tabs.profile', 'Farmer Score'), desc: 'Build reliability to unlock better terms and credit.' },
    { icon: BarChart3, title: t('buyerDash.tabs.analytics', 'Buyer Analytics'), desc: 'Cost savings, compliance trends, supplier performance.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/15 text-white/80 text-sm font-bold rounded-full mb-5 backdrop-blur-sm">
            <Sprout className="w-4 h-4 inline mr-1.5 -mt-0.5" /> {t('home.sixModules', 'Platform Features')}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 max-w-3xl">
            {t('home.platformTitle', 'Everything You Need, From Soil to Sale')}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            {t('home.platformSubtitle', '6 integrated modules that work together as a data flywheel — improving predictions, pricing, and outcomes every season.')}
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, idx) => (
        <section
          key={feature.id}
          id={feature.id}
          className={`py-16 md:py-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-offwhite bg-pattern-dots'}`}
        >
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
            <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${idx % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}>
              {/* Image */}
              <div className={`${idx % 2 !== 0 ? 'lg:[direction:ltr]' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-terracotta rounded-xl flex items-center justify-center shadow-lg">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${idx % 2 !== 0 ? 'lg:[direction:ltr]' : ''}`}>
                <span className="text-terracotta text-sm font-bold uppercase tracking-wider">
                  Module {idx + 1}
                </span>
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-black mt-2 mb-3">
                  {feature.title}
                </h2>
                <p className="text-amber font-semibold text-base mb-4">{feature.tagline}</p>
                <p className="text-medium text-base leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {feature.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                      <span className="text-sm text-dark">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Platform-wide Features */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-sage/10 text-sage text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
              {t('home.advantage', 'Platform-Wide')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-black mb-4">
              {t('home.builtForAgriculture', 'Built for Every Indian Farmer')}
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              {t('footer.description', 'Accessibility, security, and intelligence designed for real-world conditions.')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platformFeatures.map((feat, i) => (
              <div key={i} className="bg-offwhite border border-border rounded-2xl p-6 card-hover group">
                <div className="w-11 h-11 bg-sage/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sage group-hover:scale-110 transition-all">
                  <feat.icon className="w-5 h-5 text-sage group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-heading text-base font-bold text-black mb-1">{feat.title}</h4>
                <p className="text-medium text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-[800px] mx-auto px-4 md:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.startFarming', 'Start Using KISAN MITRA Today')}
          </h2>
          <p className="text-white/50 text-lg mb-8">
            {t('home.how.1.desc', 'Set up your farm profile and begin receiving AI-powered recommendations in minutes.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/farmer-dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-xl"
            >
              {t('nav.farmerDashboard', 'Get Started')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              {t('nav.marketplace', 'Browse Marketplace')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


