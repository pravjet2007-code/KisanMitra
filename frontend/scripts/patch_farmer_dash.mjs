import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'pages');
const filepath = path.join(srcDir, 'FarmerDashboard.tsx');
let content = fs.readFileSync(filepath, 'utf8');

// String Replacements for Text nodes (using regex or exact string matching)
content = content.replace(`Setup Your Farm Profile`, `{t('fd.setup.title')}`);
content = content.replace(`Fill in your details to get personalized recommendations`, `{t('fd.setup.subtitle')}`);
content = content.replace(`Full Name *`, `{t('fd.setup.name')}`);
content = content.replace(`Farm Location *`, `{t('fd.setup.location')}`);
content = content.replace(`Farm Size (Acres)`, `{t('fd.setup.size')}`);
content = content.replace(`Primary Crop`, `{t('fd.setup.crop')}`);
content = content.replace(`Select crop`, `{t('fd.setup.select')}`);
content = content.replace(`Preferred Language`, `{t('fd.setup.lang')}`);
content = content.replace(`Save & Continue`, `{t('fd.setup.save')}`);

content = content.replace(`Welcome to KISAN MITRA!`, `{t('fd.overview.welcomeTitle')}`);
content = content.replace(`Set up your farm profile to unlock personalized soil health reports, pest alerts, yield forecasts, and marketplace access.`, `{t('fd.overview.welcomeSubtitle')}`);
content = content.replace(`Setup Farm Profile`, `{t('fd.overview.welcomeBtn')}`);

content = content.replace(`Yield Forecast`, `{t('fd.stats.yield')}`);
content = content.replace(`Market Price`, `{t('fd.stats.price')}`);
content = content.replace(`Pest Risk`, `{t('fd.stats.pest')}`);
content = content.replace(`Soil Health`, `{t('fd.stats.soil')}`);
content = content.replace(`Setup required`, `{t('fd.stats.setup')}`);
content = content.replace(`Connect sensors`, `{t('fd.stats.connect')}`);

content = content.replace(`Weather Forecast`, `{t('fd.weather.title')}`);
content = content.replace(`Pest Alerts`, `{t('fd.pestAlert.title')}`);
content = content.replace(`View All`, `{t('fd.pestAlert.view')}`);
content = content.replace(`No active pest alerts. Scan your traps to get started.`, `{t('fd.pestAlert.noActive')}`);
content = content.replace(`Setup your profile and scan traps to see pest alerts.`, `{t('fd.pestAlert.noProfile')}`);

content = content.replace(`My Listings`, `{t('fd.listings.title')}`);
content = content.replace(`New Listing`, `{t('fd.listings.new')}`);
content = content.replace(`No Listings Yet`, `{t('fd.listings.none')}`);
content = content.replace(`Create your first listing to start connecting with verified buyers.`, `{t('fd.listings.desc')}`);
content = content.replace(`Create Listing`, `{t('fd.listings.create')}`);

content = content.replace(`Recent Transactions`, `{t('fd.transact.recent')}`);
content = content.replace(`Your transactions will appear here once you start selling.`, `{t('fd.transact.none')}`);

content = content.replace(`Soil Health Monitor`, `{t('fd.soil.title')}`);
content = content.replace(`pH Level`, `{t('fd.soil.ph')}`);
content = content.replace(`Nitrogen (N)`, `{t('fd.soil.n')}`);
content = content.replace(`Phosphorus (P)`, `{t('fd.soil.p')}`);
content = content.replace(`Potassium (K)`, `{t('fd.soil.k')}`);
content = content.replace(`Moisture`, `{t('fd.soil.moisture')}`);
content = content.replace(`Temperature`, `{t('fd.soil.temp')}`);
content = content.replace(`Not measured`, `{t('fd.soil.notMeasured')}`);
content = content.replace(`Connect sensor`, `{t('fd.soil.connect')}`);

content = content.replace(`Connect Sensors or Upload Lab Report`, `{t('fd.soil.connectTitle')}`);
content = content.replace(`Pair IoT sensors via Bluetooth/LoRa or upload your soil test report to get started.`, `{t('fd.soil.connectDesc')}`);
content = content.replace(`Pair Sensor`, `{t('fd.soil.btnPair')}`);
content = content.replace(`Upload Lab Report`, `{t('fd.soil.btnUpload')}`);

content = content.replace(`📸 Scan Pheromone Trap`, `{t('fd.pest.scanTrap')}`);
content = content.replace(`Upload Trap Photo`, `{t('fd.pest.uploadTrap')}`);
content = content.replace(`Take a clear photo of your sticky trap for AI analysis`, `{t('fd.pest.descTrap')}`);
content = content.replace(`Open Camera`, `{t('fd.pest.btnCamera')}`);

content = content.replace(`🍃 Scan Leaf / Crop`, `{t('fd.pest.scanLeaf')}`);
content = content.replace(`Upload Leaf Photo`, `{t('fd.pest.uploadLeaf')}`);
content = content.replace(`Photo of leaf showing symptoms for disease identification`, `{t('fd.pest.descLeaf')}`);
content = content.replace(`Open Camera`, `{t('fd.pest.btnCamera')}`);

content = content.replace(`Pest Activity History`, `{t('fd.pest.history')}`);
content = content.replace(`No scans yet. Upload trap or leaf photos to see detection results here.`, `{t('fd.pest.historyDesc')}`);

content = content.replace(`Drone Scan — Crop Health`, `{t('fd.drone.title')}`);
content = content.replace(`No Drone Scans Yet`, `{t('fd.drone.none')}`);
content = content.replace(`Pair your drone and define plot boundaries to generate autonomous flight paths and NDVI health maps.`, `{t('fd.drone.desc')}`);
content = content.replace(`Pair Drone`, `{t('fd.drone.btnPair')}`);
content = content.replace(`Book Drone-as-a-Service`, `{t('fd.drone.btnBook')}`);

content = content.replace(`Your Marketplace`, `{t('fd.market.title')}`);
content = content.replace(`Start Selling`, `{t('fd.market.start')}`);
content = content.replace(`Create listings for your produce, compare buyer offers, and sell at the best price with escrow protection.`, `{t('fd.market.desc')}`);
content = content.replace(`Price Trends`, `{t('fd.market.trends')}`);
content = content.replace(`Select your crop to see current prices and forecasts.`, `{t('fd.market.trendsDesc')}`);
content = content.replaceAll(`View prices`, `{t('fd.market.viewPrices')}`);

content = content.replace(`Total Earnings`, `{t('fd.transactTab.earnings')}`);
content = content.replace(`This season`, `{t('fd.transactTab.season')}`);
content = content.replace(`Farmer Score`, `{t('fd.transactTab.score')}`);
content = content.replace(`Complete sales to build score`, `{t('fd.transactTab.scoreDesc')}`);
content = content.replace(`Completed Orders`, `{t('fd.transactTab.orders')}`);
content = content.replace(`No disputes`, `{t('fd.transactTab.disputes')}`);
content = content.replace(`Transaction History`, `{t('fd.transactTab.history')}`);
content = content.replace(`No transactions yet. Start selling to see your payment history and Farmer Score.`, `{t('fd.transactTab.none')}`);

fs.writeFileSync(filepath, content);

// UPDATE EN.JSON
const localesPath = path.join(process.cwd(), 'src', 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(localesPath, 'utf8'));

enData.fd = {
  "setup": {
    "title": "Setup Your Farm Profile",
    "subtitle": "Fill in your details to get personalized recommendations",
    "name": "Full Name *",
    "location": "Farm Location *",
    "size": "Farm Size (Acres)",
    "crop": "Primary Crop",
    "select": "Select crop",
    "lang": "Preferred Language",
    "save": "Save & Continue"
  },
  "overview": {
    "welcomeTitle": "Welcome to KISAN MITRA!",
    "welcomeSubtitle": "Set up your farm profile to unlock personalized soil health reports, pest alerts, yield forecasts, and marketplace access.",
    "welcomeBtn": "Setup Farm Profile"
  },
  "stats": {
    "yield": "Yield Forecast",
    "price": "Market Price",
    "pest": "Pest Risk",
    "soil": "Soil Health",
    "setup": "Setup required",
    "connect": "Connect sensors"
  },
  "weather": {
    "title": "Weather Forecast"
  },
  "pestAlert": {
    "title": "Pest Alerts",
    "view": "View All",
    "noActive": "No active pest alerts. Scan your traps to get started.",
    "noProfile": "Setup your profile and scan traps to see pest alerts."
  },
  "listings": {
    "title": "My Listings",
    "new": "New Listing",
    "none": "No Listings Yet",
    "desc": "Create your first listing to start connecting with verified buyers.",
    "create": "Create Listing"
  },
  "transact": {
    "recent": "Recent Transactions",
    "none": "Your transactions will appear here once you start selling."
  },
  "soil": {
    "title": "Soil Health Monitor",
    "ph": "pH Level",
    "n": "Nitrogen (N)",
    "p": "Phosphorus (P)",
    "k": "Potassium (K)",
    "moisture": "Moisture",
    "temp": "Temperature",
    "notMeasured": "Not measured",
    "connect": "Connect sensor",
    "connectTitle": "Connect Sensors or Upload Lab Report",
    "connectDesc": "Pair IoT sensors via Bluetooth/LoRa or upload your soil test report to get started.",
    "btnPair": "Pair Sensor",
    "btnUpload": "Upload Lab Report"
  },
  "pest": {
    "scanTrap": "📸 Scan Pheromone Trap",
    "uploadTrap": "Upload Trap Photo",
    "descTrap": "Take a clear photo of your sticky trap for AI analysis",
    "scanLeaf": "🍃 Scan Leaf / Crop",
    "uploadLeaf": "Upload Leaf Photo",
    "descLeaf": "Photo of leaf showing symptoms for disease identification",
    "btnCamera": "Open Camera",
    "history": "Pest Activity History",
    "historyDesc": "No scans yet. Upload trap or leaf photos to see detection results here."
  },
  "drone": {
    "title": "Drone Scan — Crop Health",
    "none": "No Drone Scans Yet",
    "desc": "Pair your drone and define plot boundaries to generate autonomous flight paths and NDVI health maps.",
    "btnPair": "Pair Drone",
    "btnBook": "Book Drone-as-a-Service"
  },
  "market": {
    "title": "Your Marketplace",
    "start": "Start Selling",
    "desc": "Create listings for your produce, compare buyer offers, and sell at the best price with escrow protection.",
    "trends": "Price Trends",
    "trendsDesc": "Select your crop to see current prices and forecasts.",
    "viewPrices": "View prices"
  },
  "transactTab": {
    "earnings": "Total Earnings",
    "season": "This season",
    "score": "Farmer Score",
    "scoreDesc": "Complete sales to build score",
    "orders": "Completed Orders",
    "disputes": "No disputes",
    "history": "Transaction History",
    "none": "No transactions yet. Start selling to see your payment history and Farmer Score."
  }
};

fs.writeFileSync(localesPath, JSON.stringify(enData, null, 2));
console.log('FarmerDashboard patched and en.json updated securely!');
