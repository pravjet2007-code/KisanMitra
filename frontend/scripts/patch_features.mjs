import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'pages');
const filepath = path.join(srcDir, 'FeaturesPage.tsx');
let content = fs.readFileSync(filepath, 'utf8');

// Move arrays inside the component
content = content.replace(
  `const features = [`,
  `export default function FeaturesPage() {
  const { t } = useTranslation();

  const features = [`
);

// Delete the original component export line
content = content.replace(
  `export default function FeaturesPage() {
  const { t } = useTranslation();
  return (`,
  `  return (`
);

// Soil Module
content = content.replace(`title: 'Soil Health & Fertilizer Advisor'`, `title: t('featuresC.soil.title')`);
content = content.replace(`tagline: 'Know your soil. Feed it right.'`, `tagline: t('featuresC.soil.tag')`);
content = content.replace(`description: 'Connect low-cost IoT sensors to measure pH, NPK, moisture, and temperature in real-time. Get plot-wise fertilizer recommendations tailored to your crop stage and soil condition.'`, `description: t('featuresC.soil.desc')`);
content = content.replace(`capabilities: [
      'IoT sensor integration (BLE/LoRa/NB-IoT)',
      'Lab report upload with OCR',
      'Plot-wise nutrient deficiency mapping',
      'Split-dose fertilizer recommendations',
      'Organic & bio-fertilizer alternatives',
      'Direct input ordering from marketplace',
    ],`, `capabilities: [t('featuresC.soil.c1'), t('featuresC.soil.c2'), t('featuresC.soil.c3'), t('featuresC.soil.c4'), t('featuresC.soil.c5'), t('featuresC.soil.c6')],`);

// Pest Module
content = content.replace(`title: 'Pest & Disease Monitoring'`, `title: t('featuresC.pest.title')`);
content = content.replace(`tagline: 'Catch threats before they spread.'`, `tagline: t('featuresC.pest.tag')`);
content = content.replace(`description: 'Use your phone camera to scan pheromone sticky traps and leaf photos. On-device AI counts, classifies insects, identifies diseases, and predicts outbreaks using weather and community data.'`, `description: t('featuresC.pest.desc')`);
content = content.replace(`capabilities: [
      'Phone-based trap scanning (AI counts & classifies)',
      'Leaf photo disease identification',
      'Outbreak risk scoring & prediction',
      'Eco-friendly treatment recommendations',
      'Community signal aggregation',
      'SMS/WhatsApp alerts for pest risks',
    ],`, `capabilities: [t('featuresC.pest.c1'), t('featuresC.pest.c2'), t('featuresC.pest.c3'), t('featuresC.pest.c4'), t('featuresC.pest.c5'), t('featuresC.pest.c6')],`);

// Drone Module
content = content.replace(`title: 'Drone Crop Health & Irrigation'`, `title: t('featuresC.drone.title')`);
content = content.replace(`tagline: 'See your fields from above.'`, `tagline: t('featuresC.drone.tag')`);
content = content.replace(`description: 'Pair supported drones and generate autonomous flight paths using your plot boundaries. Get NDVI/NDRE health maps, stress zone detection, and targeted spraying/irrigation guidance.'`, `description: t('featuresC.drone.desc')`);
content = content.replace(`capabilities: [
      'Boundary-based autonomous flight paths',
      'NDVI/NDRE vegetation index maps',
      'Stress zone & disease zone detection',
      'Targeted spraying area guidance',
      'Irrigation adjustment recommendations',
      'Processing in under 30 minutes',
    ],`, `capabilities: [t('featuresC.drone.c1'), t('featuresC.drone.c2'), t('featuresC.drone.c3'), t('featuresC.drone.c4'), t('featuresC.drone.c5'), t('featuresC.drone.c6')],`);

// Yield Module
content = content.replace(`title: 'Yield Prediction & Price Forecasting'`, `title: t('featuresC.yield.title')`);
content = content.replace(`tagline: 'Plan your sale before the harvest.'`, `tagline: t('featuresC.yield.tag')`);
content = content.replace(`description: 'AI models combine your soil, pest, drone, weather, and regional data to forecast your plot-level yield with confidence bands. Price forecasting helps you decide when and where to sell.'`, `description: t('featuresC.yield.desc')`);
content = content.replace(`capabilities: [
      'Plot-level yield prediction (MAPE ≤ 15–20%)',
      'Price forecast for 1–6 weeks ahead',
      'Mandi vs buyer price comparison',
      'Net realization calculator (incl. transport)',
      '"What-if" scenario analysis',
      'Direct marketplace listing from forecast',
    ],`, `capabilities: [t('featuresC.yield.c1'), t('featuresC.yield.c2'), t('featuresC.yield.c3'), t('featuresC.yield.c4'), t('featuresC.yield.c5'), t('featuresC.yield.c6')],`);

// Transact Module
content = content.replace(`title: 'Secure Transactions & Farmer Score'`, `title: t('featuresC.transact.title')`);
content = content.replace(`tagline: 'Trust-first trading.'`, `tagline: t('featuresC.transact.tag')`);
content = content.replace(`description: 'Every transaction is protected by digital contracts, escrow payments, and standardized quality checks. Build your Farmer Score to unlock better deals and credit access.'`, `description: t('featuresC.transact.desc')`);
content = content.replace(`capabilities: [
      'Digital contracts with clear terms',
      'Escrow-protected payments (UPI)',
      'Standardized quality verification checklists',
      'Farmer Score based on performance metrics',
      '24-hour dispute resolution with mediation',
      'Full transaction history & audit trail',
    ],`, `capabilities: [t('featuresC.transact.c1'), t('featuresC.transact.c2'), t('featuresC.transact.c3'), t('featuresC.transact.c4'), t('featuresC.transact.c5'), t('featuresC.transact.c6')],`);

// Platform Features Array
content = content.replace(`title: '08 Languages'`, `title: t('featuresC.plat.lang.t')`);
content = content.replace(`desc: 'Full UI and content in all scheduled Indian languages.'`, `desc: t('featuresC.plat.lang.d')`);
content = content.replace(`title: 'Voice Interface'`, `title: t('featuresC.plat.voice.t')`);
content = content.replace(`desc: 'Speak commands in your language for hands-free operation.'`, `desc: t('featuresC.plat.voice.d')`);
content = content.replace(`title: 'Offline Mode'`, `title: t('featuresC.plat.offline.t')`);
content = content.replace(`desc: 'Core features work without internet. Sync when connected.'`, `desc: t('featuresC.plat.offline.d')`);
content = content.replace(`title: 'Data Privacy'`, `title: t('featuresC.plat.priv.t')`);
content = content.replace(`desc: 'End-to-end encryption. You control what buyers see.'`, `desc: t('featuresC.plat.priv.d')`);
content = content.replace(`title: 'Lot Traceability'`, `title: t('featuresC.plat.trace.t')`);
content = content.replace(`desc: 'Complete farm-to-buyer passport for every transaction.'`, `desc: t('featuresC.plat.trace.d')`);
content = content.replace(`title: 'Logistics Integration'`, `title: t('featuresC.plat.logis.t')`);
content = content.replace(`desc: 'Partner transport with rates, ETAs, and tracking.'`, `desc: t('featuresC.plat.logis.d')`);
content = content.replace(`title: 'Farmer Score'`, `title: t('featuresC.plat.score.t')`);
content = content.replace(`desc: 'Build reliability to unlock better terms and credit.'`, `desc: t('featuresC.plat.score.d')`);
content = content.replace(`title: 'Buyer Analytics'`, `title: t('featuresC.plat.analyt.t')`);
content = content.replace(`desc: 'Cost savings, compliance trends, supplier performance.'`, `desc: t('featuresC.plat.analyt.d')`);

content = content.replace(`>Module <`, `>{t('featuresC.module')} <`);

fs.writeFileSync(filepath, content);

// UPDATE EN.JSON
const localesPath = path.join(process.cwd(), 'src', 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(localesPath, 'utf8'));

enData.featuresC = {
  "module": "Module",
  "soil": {
    "title": "Soil Health & Fertilizer Advisor",
    "tag": "Know your soil. Feed it right.",
    "desc": "Connect low-cost IoT sensors to measure pH, NPK, moisture, and temperature in real-time. Get plot-wise fertilizer recommendations tailored to your crop stage and soil condition.",
    "c1": "IoT sensor integration (BLE/LoRa/NB-IoT)",
    "c2": "Lab report upload with OCR",
    "c3": "Plot-wise nutrient deficiency mapping",
    "c4": "Split-dose fertilizer recommendations",
    "c5": "Organic & bio-fertilizer alternatives",
    "c6": "Direct input ordering from marketplace"
  },
  "pest": {
    "title": "Pest & Disease Monitoring",
    "tag": "Catch threats before they spread.",
    "desc": "Use your phone camera to scan pheromone sticky traps and leaf photos. On-device AI counts, classifies insects, identifies diseases, and predicts outbreaks using weather and community data.",
    "c1": "Phone-based trap scanning (AI counts & classifies)",
    "c2": "Leaf photo disease identification",
    "c3": "Outbreak risk scoring & prediction",
    "c4": "Eco-friendly treatment recommendations",
    "c5": "Community signal aggregation",
    "c6": "SMS/WhatsApp alerts for pest risks"
  },
  "drone": {
    "title": "Drone Crop Health & Irrigation",
    "tag": "See your fields from above.",
    "desc": "Pair supported drones and generate autonomous flight paths using your plot boundaries. Get NDVI/NDRE health maps, stress zone detection, and targeted spraying/irrigation guidance.",
    "c1": "Boundary-based autonomous flight paths",
    "c2": "NDVI/NDRE vegetation index maps",
    "c3": "Stress zone & disease zone detection",
    "c4": "Targeted spraying area guidance",
    "c5": "Irrigation adjustment recommendations",
    "c6": "Processing in under 30 minutes"
  },
  "yield": {
    "title": "Yield Prediction & Price Forecasting",
    "tag": "Plan your sale before the harvest.",
    "desc": "AI models combine your soil, pest, drone, weather, and regional data to forecast your plot-level yield with confidence bands. Price forecasting helps you decide when and where to sell.",
    "c1": "Plot-level yield prediction (MAPE ≤ 15–20%)",
    "c2": "Price forecast for 1–6 weeks ahead",
    "c3": "Mandi vs buyer price comparison",
    "c4": "Net realization calculator (incl. transport)",
    "c5": "\"What-if\" scenario analysis",
    "c6": "Direct marketplace listing from forecast"
  },
  "transact": {
    "title": "Secure Transactions & Farmer Score",
    "tag": "Trust-first trading.",
    "desc": "Every transaction is protected by digital contracts, escrow payments, and standardized quality checks. Build your Farmer Score to unlock better deals and credit access.",
    "c1": "Digital contracts with clear terms",
    "c2": "Escrow-protected payments (UPI)",
    "c3": "Standardized quality verification checklists",
    "c4": "Farmer Score based on performance metrics",
    "c5": "24-hour dispute resolution with mediation",
    "c6": "Full transaction history & audit trail"
  },
  "plat": {
    "lang": { "t": "08 Languages", "d": "Full UI and content in all scheduled Indian languages." },
    "voice": { "t": "Voice Interface", "d": "Speak commands in your language for hands-free operation." },
    "offline": { "t": "Offline Mode", "d": "Core features work without internet. Sync when connected." },
    "priv": { "t": "Data Privacy", "d": "End-to-end encryption. You control what buyers see." },
    "trace": { "t": "Lot Traceability", "d": "Complete farm-to-buyer passport for every transaction." },
    "logis": { "t": "Logistics Integration", "d": "Partner transport with rates, ETAs, and tracking." },
    "score": { "t": "Farmer Score", "d": "Build reliability to unlock better terms and credit." },
    "analyt": { "t": "Buyer Analytics", "d": "Cost savings, compliance trends, supplier performance." }
  }
};

fs.writeFileSync(localesPath, JSON.stringify(enData, null, 2));
console.log('FeaturesPage patched and en.json updated securely!');
