import fs from 'fs';
import path from 'path';

// This script injects useTranslation deeply into the remaining arrays
const srcDir = path.join(process.cwd(), 'src', 'pages');

const homepagePath = path.join(srcDir, 'HomePage.tsx');
let homeContent = fs.readFileSync(homepagePath, 'utf8');

// Move arrays inside the component so they can use `t`
homeContent = homeContent.replace(
  `const stats = [`, 
  `export default function HomePage() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const stats = [`
);

// Remove the old component declaration
homeContent = homeContent.replace(
  `export default function HomePage() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState(0);
  const [showVideo, setShowVideo] = useState(false);`,
  ``
);

// Replace array strings with t()
homeContent = homeContent.replace(`label: 'Active Farmers'`, `label: t('home.stats.farmers')`);
homeContent = homeContent.replace(`label: 'Verified Buyers'`, `label: t('home.stats.buyers')`);
homeContent = homeContent.replace(`label: 'Annual GMV'`, `label: t('home.stats.gmv')`);
homeContent = homeContent.replace(`label: 'Languages'`, `label: t('home.stats.languages')`);

homeContent = homeContent.replace(`title: 'Soil Health & Fertilizer Advisor'`, `title: t('home.modules.soil.title')`);
homeContent = homeContent.replace(`desc: 'IoT sensors measure pH, NPK, moisture & temperature. Get plot-wise nutrient recommendations and order inputs directly.'`, `desc: t('home.modules.soil.desc')`);
homeContent = homeContent.replace(`metrics: ['25% less fertilizer waste', 'Plot-wise nutrient maps', 'Direct input ordering']`, `metrics: [t('home.modules.soil.m1'), t('home.modules.soil.m2'), t('home.modules.soil.m3')]`);

homeContent = homeContent.replace(`title: 'Pest & Disease Monitoring'`, `title: t('home.modules.pest.title')`);
homeContent = homeContent.replace(`desc: 'Phone-based AI scans pheromone traps and leaf photos. Get outbreak predictions and eco-friendly treatment plans.'`, `desc: t('home.modules.pest.desc')`);
homeContent = homeContent.replace(`metrics: ['80%+ classification accuracy', 'Community outbreak alerts', 'Treatment guidance']`, `metrics: [t('home.modules.pest.m1'), t('home.modules.pest.m2'), t('home.modules.pest.m3')]`);

homeContent = homeContent.replace(`title: 'Drone Crop Health & Irrigation'`, `title: t('home.modules.drone.title')`);
homeContent = homeContent.replace(`desc: 'Autonomous drone flight paths using plot boundaries. NDVI/NDRE maps identify stress zones for targeted action.'`, `desc: t('home.modules.drone.desc')`);
homeContent = homeContent.replace(`metrics: ['Precision intervention maps', '30-min processing', 'Targeted spraying guidance']`, `metrics: [t('home.modules.drone.m1'), t('home.modules.drone.m2'), t('home.modules.drone.m3')]`);

homeContent = homeContent.replace(`title: 'Yield Prediction & Marketplace'`, `title: t('home.modules.yield.title')`);
homeContent = homeContent.replace(`desc: 'AI combines soil + pest + drone + weather data to forecast yields and market prices. Connect directly with buyers.'`, `desc: t('home.modules.yield.desc')`);
homeContent = homeContent.replace(`metrics: ['15-20% MAPE accuracy', 'Real-time price forecasts', 'Direct buyer connections']`, `metrics: [t('home.modules.yield.m1'), t('home.modules.yield.m2'), t('home.modules.yield.m3')]`);

homeContent = homeContent.replace(`title: 'Secure Transactions & Farmer Score'`, `title: t('home.modules.secure.title')`);
homeContent = homeContent.replace(`desc: 'Digital contracts with escrow payments, quality verification, and reputation scoring for better credit access.'`, `desc: t('home.modules.secure.desc')`);
homeContent = homeContent.replace(`metrics: ['98% payment success', '<5 min UPI payout', '<2% dispute rate']`, `metrics: [t('home.modules.secure.m1'), t('home.modules.secure.m2'), t('home.modules.secure.m3')]`);

// How it works
homeContent = homeContent.replace(`title: 'Setup Your Farm'`, `title: t('home.how.1.title')`);
homeContent = homeContent.replace(`desc: 'Create profile, draw boundaries on map, connect IoT sensors — all in minutes.'`, `desc: t('home.how.1.desc')`);
homeContent = homeContent.replace(`title: 'Get AI Insights'`, `title: t('home.how.2.title')`);
homeContent = homeContent.replace(`desc: 'Receive soil reports, pest alerts, drone maps, yield forecasts, and fertilizer plans.'`, `desc: t('home.how.2.desc')`);
homeContent = homeContent.replace(`title: 'Sell Smart'`, `title: t('home.how.3.title')`);
homeContent = homeContent.replace(`desc: 'List produce, compare buyer offers, and get paid securely via escrow with UPI.'`, `desc: t('home.how.3.desc')`);

// Replace loose text nodes
homeContent = homeContent.replace(`<span>Voice Supported</span>`, `<span>{t('home.voiceSupported')}</span>`);
homeContent = homeContent.replace(`<span>22 Languages</span>`, `<span>{t('home.languages')}</span>`);
homeContent = homeContent.replace(`<span>Secure Payments</span>`, `<span>{t('home.securePayments')}</span>`);
homeContent = homeContent.replace(`Join as Buyer`, `{t('home.joinBuyer')}`);
homeContent = homeContent.replace(`Watch Demo`, `{t('home.watchDemo')}`);
homeContent = homeContent.replace(`>Scroll<`, `>{t('home.scroll')}<`);
homeContent = homeContent.replace(`3-Step Process`, `{t('home.threeStep')}`);
homeContent = homeContent.replace(`How It Works`, `{t('home.howItWorksTitle')}`);
homeContent = homeContent.replace(`From sowing to selling — we're with you every step.`, `{t('home.howItWorksSubtitle')}`);
homeContent = homeContent.replace(`5 Powerful Modules`, `{t('home.fiveModules')}`);
homeContent = homeContent.replace(`Complete Farm-to-Market Platform`, `{t('home.platformTitle')}`);
homeContent = homeContent.replace(`Each module strengthens the others — creating a data flywheel that improves every season.`, `{t('home.platformSubtitle')}`);
homeContent = homeContent.replace(`Explore Module`, `{t('home.exploreModule')}`);
homeContent = homeContent.replace(`>Our Advantage<`, `>{t('home.advantage')}<`);
homeContent = homeContent.replace(`The Data Flywheel Effect`, `{t('home.flywheelTitle')}`);
homeContent = homeContent.replace(`Each season of data makes the entire platform smarter for everyone.`, `{t('home.flywheelSubtitle')}`);

fs.writeFileSync(homepagePath, homeContent);

// UPDATE EN.JSON WITH NEW KEYS
const localesPath = path.join(process.cwd(), 'src', 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(localesPath, 'utf8'));

enData.home = {
  ...enData.home,
  "stats": {
    "farmers": "Active Farmers",
    "buyers": "Verified Buyers",
    "gmv": "Annual GMV",
    "languages": "Languages"
  },
  "modules": {
    "soil": {
      "title": "Soil Health & Fertilizer Advisor",
      "desc": "IoT sensors measure pH, NPK, moisture & temperature. Get plot-wise nutrient recommendations and order inputs directly.",
      "m1": "25% less fertilizer waste",
      "m2": "Plot-wise nutrient maps",
      "m3": "Direct input ordering"
    },
    "pest": {
      "title": "Pest & Disease Monitoring",
      "desc": "Phone-based AI scans pheromone traps and leaf photos. Get outbreak predictions and eco-friendly treatment plans.",
      "m1": "80%+ classification accuracy",
      "m2": "Community outbreak alerts",
      "m3": "Treatment guidance"
    },
    "drone": {
      "title": "Drone Crop Health & Irrigation",
      "desc": "Autonomous drone flight paths using plot boundaries. NDVI/NDRE maps identify stress zones for targeted action.",
      "m1": "Precision intervention maps",
      "m2": "30-min processing",
      "m3": "Targeted spraying guidance"
    },
    "yield": {
      "title": "Yield Prediction & Marketplace",
      "desc": "AI combines soil + pest + drone + weather data to forecast yields and market prices. Connect directly with buyers.",
      "m1": "15-20% MAPE accuracy",
      "m2": "Real-time price forecasts",
      "m3": "Direct buyer connections"
    },
    "secure": {
      "title": "Secure Transactions & Farmer Score",
      "desc": "Digital contracts with escrow payments, quality verification, and reputation scoring for better credit access.",
      "m1": "98% payment success",
      "m2": "< 5 min UPI payout",
      "m3": "< 2% dispute rate"
    }
  },
  "how": {
    "1": { "title": "Setup Your Farm", "desc": "Create profile, draw boundaries on map, connect IoT sensors — all in minutes." },
    "2": { "title": "Get AI Insights", "desc": "Receive soil reports, pest alerts, drone maps, yield forecasts, and fertilizer plans." },
    "3": { "title": "Sell Smart", "desc": "List produce, compare buyer offers, and get paid securely via escrow with UPI." }
  },
  "voiceSupported": "Voice Supported",
  "languages": "22 Languages",
  "securePayments": "Secure Payments",
  "joinBuyer": "Join as Buyer",
  "watchDemo": "Watch Demo",
  "scroll": "Scroll",
  "threeStep": "3-Step Process",
  "howItWorksTitle": "How It Works",
  "howItWorksSubtitle": "From sowing to selling — we're with you every step.",
  "fiveModules": "5 Powerful Modules",
  "platformTitle": "Complete Farm-to-Market Platform",
  "platformSubtitle": "Each module strengthens the others — creating a data flywheel that improves every season.",
  "exploreModule": "Explore Module",
  "advantage": "Our Advantage",
  "flywheelTitle": "The Data Flywheel Effect",
  "flywheelSubtitle": "Each season of data makes the entire platform smarter for everyone."
};

fs.writeFileSync(localesPath, JSON.stringify(enData, null, 2));
console.log('Homepage patched and en.json updated securely!');
