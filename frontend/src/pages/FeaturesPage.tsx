import { Link } from 'react-router-dom';
import {
  Leaf, Bug, Plane, TrendingUp, Shield, Smartphone, Globe,
  Mic, CheckCircle2, ArrowRight, Sprout, Users, Lock,
  BarChart3, Truck, ScanLine
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const features = [
  {
    id: 'soil',
    icon: Leaf,
    title: 'Soil Health & Fertilizer Advisor',
    tagline: 'Know your soil. Feed it right.',
    description: 'Connect low-cost IoT sensors to measure pH, NPK, moisture, and temperature in real-time. Get plot-wise fertilizer recommendations tailored to your crop stage and soil condition.',
    capabilities: [
      'IoT sensor integration (BLE/LoRa/NB-IoT)',
      'Lab report upload with OCR',
      'Plot-wise nutrient deficiency mapping',
      'Split-dose fertilizer recommendations',
      'Organic & bio-fertilizer alternatives',
      'Direct input ordering from marketplace',
    ],
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  },
  {
    id: 'pest',
    icon: Bug,
    title: 'Pest & Disease Monitoring',
    tagline: 'Catch threats before they spread.',
    description: 'Use your phone camera to scan pheromone sticky traps and leaf photos. On-device AI counts, classifies insects, identifies diseases, and predicts outbreaks using weather and community data.',
    capabilities: [
      'Phone-based trap scanning (AI counts & classifies)',
      'Leaf photo disease identification',
      'Outbreak risk scoring & prediction',
      'Eco-friendly treatment recommendations',
      'Community signal aggregation',
      'SMS/WhatsApp alerts for pest risks',
    ],
    img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=800&q=80',
  },
  {
    id: 'drone',
    icon: Plane,
    title: 'Drone Crop Health & Irrigation',
    tagline: 'See your fields from above.',
    description: 'Pair supported drones and generate autonomous flight paths using your plot boundaries. Get NDVI/NDRE health maps, stress zone detection, and targeted spraying/irrigation guidance.',
    capabilities: [
      'Boundary-based autonomous flight paths',
      'NDVI/NDRE vegetation index maps',
      'Stress zone & disease zone detection',
      'Targeted spraying area guidance',
      'Irrigation adjustment recommendations',
      'Processing in under 30 minutes',
    ],
    img: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80',
  },
  {
    id: 'yield',
    icon: TrendingUp,
    title: 'Yield Prediction & Price Forecasting',
    tagline: 'Plan your sale before the harvest.',
    description: 'AI models combine your soil, pest, drone, weather, and regional data to forecast your plot-level yield with confidence bands. Price forecasting helps you decide when and where to sell.',
    capabilities: [
      'Plot-level yield prediction (MAPE ≤ 15–20%)',
      'Price forecast for 1–6 weeks ahead',
      'Mandi vs buyer price comparison',
      'Net realization calculator (incl. transport)',
      '"What-if" scenario analysis',
      'Direct marketplace listing from forecast',
    ],
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
  },
  {
    id: 'transactions',
    icon: Shield,
    title: 'Secure Transactions & Farmer Score',
    tagline: 'Trust-first trading.',
    description: 'Every transaction is protected by digital contracts, escrow payments, and standardized quality checks. Build your Farmer Score to unlock better deals and credit access.',
    capabilities: [
      'Digital contracts with clear terms',
      'Escrow-protected payments (UPI)',
      'Standardized quality verification checklists',
      'Farmer Score based on performance metrics',
      '24-hour dispute resolution with mediation',
      'Full transaction history & audit trail',
    ],
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  },
];

const platformFeatures = [
  { icon: Globe, title: '08 Languages', desc: 'Full UI and content in all scheduled Indian languages.' },
  { icon: Mic, title: 'Voice Interface', desc: 'Speak commands in your language for hands-free operation.' },
  { icon: Smartphone, title: 'Offline Mode', desc: 'Core features work without internet. Sync when connected.' },
  { icon: Lock, title: 'Data Privacy', desc: 'End-to-end encryption. You control what buyers see.' },
  { icon: ScanLine, title: 'Lot Traceability', desc: 'Complete farm-to-buyer passport for every transaction.' },
  { icon: Truck, title: 'Logistics Integration', desc: 'Partner transport with rates, ETAs, and tracking.' },
  { icon: Users, title: 'Farmer Score', desc: 'Build reliability to unlock better terms and credit.' },
  { icon: BarChart3, title: 'Buyer Analytics', desc: 'Cost savings, compliance trends, supplier performance.' },
];

export default function FeaturesPage() {
  const { t } = useTranslation();
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
            <Sprout className="w-4 h-4 inline mr-1.5 -mt-0.5" /> {t('featuresPage.platformFeatures')}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 max-w-3xl">
            {t('featuresPage.heroTitle')}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            {t('featuresPage.heroSubtitle')}
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
              Platform-Wide
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-black mb-4">
              {t('featuresPage.builtFor')}
            </h2>
            <p className="text-medium text-lg max-w-2xl mx-auto">
              {t('featuresPage.builtForSubtitle')}
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
            {t('featuresPage.ctaTitle')}
          </h2>
          <p className="text-white/50 text-lg mb-8">
            {t('featuresPage.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/farmer-dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta-dark transition-all shadow-xl"
            >
              {t('nav.getStarted')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              {t('featuresPage.browseMarketplace')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
