import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'pages');
const filepath = path.join(srcDir, 'BuyerDashboard.tsx');
let content = fs.readFileSync(filepath, 'utf8');

// Replacements
content = content.replace(`Business Onboarding`, `{t('bd.setup.title')}`);
content = content.replace(`Complete KYB verification to access supply forecasts and listings`, `{t('bd.setup.subtitle')}`);
content = content.replace(`Business Name *`, `{t('bd.setup.name')}`);
content = content.replace(`Business Type`, `{t('bd.setup.type')}`);
content = content.replace(`Select type`, `{t('bd.setup.selectType')}`);
content = content.replace(`Location *`, `{t('bd.setup.location')}`);
content = content.replace(`Crop Preferences`, `{t('bd.setup.crops')}`);
content = content.replace(`GST / FSSAI Document`, `{t('bd.setup.gst')}`);
content = content.replace(`Click to upload verification documents`, `{t('bd.setup.uploadDst')}`);
content = content.replace(`Submit for Verification`, `{t('bd.setup.submit')}`);

content = content.replace(`Welcome to KISAN MITRA Buyer Portal`, `{t('bd.overview.welcomeTitle')}`);
content = content.replace(`Complete your business onboarding to access supply forecasts, verified listings, and procurement tools.`, `{t('bd.overview.welcomeSub')}`);
content = content.replace(`Setup Business Profile`, `{t('bd.overview.setupBtn')}`);

content = content.replace(`Active Alerts`, `{t('bd.stats.alerts')}`);
content = content.replace(`Available Supply`, `{t('bd.stats.supply')}`);
content = content.replace(`Cost Savings`, `{t('bd.stats.savings')}`);

content = content.replace(`Procurement Alerts`, `{t('bd.overview.alertsTitle')}`);
content = content.replace(`No alerts yet. Set up preferences to receive supply matching notifications.`, `{t('bd.overview.noAlerts')}`);

content = content.replace(`Available Listings`, `{t('bd.overview.listTitle')}`);
content = content.replace(`Browse All`, `{t('bd.overview.browseAll')}`);
content = content.replace(`Browse the Marketplace`, `{t('bd.overview.browseMarket')}`);
content = content.replace(`Find verified farmer listings with quality data, drone maps, and Farmer Scores.`, `{t('bd.overview.marketDesc')}`);

content = content.replace(`Regional Supply Forecast`, `{t('bd.forecast.title')}`);
content = content.replace(`Forecast loading...`, `{t('bd.forecast.loading')}`);
content = content.replace(`Supply forecasts will populate as farmer data accumulates in your preferred regions.`, `{t('bd.forecast.desc')}`);

content = content.replace(`Search by crop, location, or farmer...`, `{t('bd.listings.search')}`);
content = content.replace(`Go to Full Marketplace`, `{t('bd.listings.goTo')}`);
content = content.replace(`Browse all verified farm listings with advanced filters.`, `{t('bd.listings.desc')}`);

content = content.replace(`Order Management`, `{t('bd.orders.title')}`);
content = content.replace(`No Orders Yet`, `{t('bd.orders.none')}`);
content = content.replace(`Browse listings and make your first purchase to see orders here.`, `{t('bd.orders.desc')}`);

content = content.replace(`Avg. Cost vs Mandi`, `{t('bd.analytics.cost')}`);
content = content.replace(`Complete orders to track`, `{t('bd.analytics.track')}`);
content = content.replace(`Quality Compliance`, `{t('bd.analytics.quality')}`);
content = content.replace(`No data yet`, `{t('bd.analytics.noData')}`);
content = content.replace(`Dispute Rate`, `{t('bd.analytics.dispute')}`);
content = content.replace(`Clean record`, `{t('bd.analytics.clean')}`);
content = content.replace(`Preferred Suppliers`, `{t('bd.analytics.suppliers')}`);
content = content.replace(`Tag farmers after purchase`, `{t('bd.analytics.tagFarmers')}`);
content = content.replace(`Procurement Analytics`, `{t('bd.analytics.title')}`);
content = content.replace(`Analytics will populate as you complete procurement transactions.`, `{t('bd.analytics.desc')}`);

content = content.replace(`Lot Traceability`, `{t('bd.trace.title')}`);
content = content.replace(`Complete farm-to-buyer history for compliance and export readiness.`, `{t('bd.trace.subtitle')}`);
content = content.replace(`No Traceability Records`, `{t('bd.trace.none')}`);
content = content.replace(`Once you complete a purchase, a full lot passport will be generated with soil, pest, drone, and quality data.`, `{t('bd.trace.desc')}`);

// Types 
content = content.replace(`Miller`, `{t('bd.setup.miller')}`);
content = content.replace(`Trader`, `{t('bd.setup.trader')}`);
content = content.replace(`Exporter`, `{t('bd.setup.exporter')}`);
content = content.replace(`Cooperative`, `{t('bd.setup.coop')}`);
content = content.replace(`Retailer`, `{t('bd.setup.retail')}`);
content = content.replace(`Processor`, `{t('bd.setup.process')}`);

fs.writeFileSync(filepath, content);

// UPDATE EN.JSON
const localesPath = path.join(process.cwd(), 'src', 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(localesPath, 'utf8'));

enData.bd = {
  "setup": {
    "title": "Business Onboarding",
    "subtitle": "Complete KYB verification to access supply forecasts and listings",
    "name": "Business Name *",
    "type": "Business Type",
    "selectType": "Select type",
    "location": "Location *",
    "crops": "Crop Preferences",
    "gst": "GST / FSSAI Document",
    "uploadDst": "Click to upload verification documents",
    "submit": "Submit for Verification",
    "miller": "Miller",
    "trader": "Trader",
    "exporter": "Exporter",
    "coop": "Cooperative",
    "retail": "Retailer",
    "process": "Processor"
  },
  "overview": {
    "welcomeTitle": "Welcome to KISAN MITRA Buyer Portal",
    "welcomeSub": "Complete your business onboarding to access supply forecasts, verified listings, and procurement tools.",
    "setupBtn": "Setup Business Profile",
    "alertsTitle": "Procurement Alerts",
    "noAlerts": "No alerts yet. Set up preferences to receive supply matching notifications.",
    "listTitle": "Available Listings",
    "browseAll": "Browse All",
    "browseMarket": "Browse the Marketplace",
    "marketDesc": "Find verified farmer listings with quality data, drone maps, and Farmer Scores."
  },
  "stats": {
    "alerts": "Active Alerts",
    "supply": "Available Supply",
    "savings": "Cost Savings"
  },
  "forecast": {
    "title": "Regional Supply Forecast",
    "loading": "Forecast loading...",
    "desc": "Supply forecasts will populate as farmer data accumulates in your preferred regions."
  },
  "listings": {
    "search": "Search by crop, location, or farmer...",
    "goTo": "Go to Full Marketplace",
    "desc": "Browse all verified farm listings with advanced filters."
  },
  "orders": {
    "title": "Order Management",
    "none": "No Orders Yet",
    "desc": "Browse listings and make your first purchase to see orders here."
  },
  "analytics": {
    "cost": "Avg. Cost vs Mandi",
    "track": "Complete orders to track",
    "quality": "Quality Compliance",
    "noData": "No data yet",
    "dispute": "Dispute Rate",
    "clean": "Clean record",
    "suppliers": "Preferred Suppliers",
    "tagFarmers": "Tag farmers after purchase",
    "title": "Procurement Analytics",
    "desc": "Analytics will populate as you complete procurement transactions."
  },
  "trace": {
    "title": "Lot Traceability",
    "subtitle": "Complete farm-to-buyer history for compliance and export readiness.",
    "none": "No Traceability Records",
    "desc": "Once you complete a purchase, a full lot passport will be generated with soil, pest, drone, and quality data."
  }
};

fs.writeFileSync(localesPath, JSON.stringify(enData, null, 2));
console.log('BuyerDashboard patched and en.json updated securely!');
