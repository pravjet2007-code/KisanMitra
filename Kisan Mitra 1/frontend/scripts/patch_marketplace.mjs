import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'pages');
const filepath = path.join(srcDir, 'Marketplace.tsx');
let content = fs.readFileSync(filepath, 'utf8');

// Replace standard arrays by moving them into the component
content = content.replace(
  `const allListings = [`,
  `export default function Marketplace() {
  const { t } = useTranslation();

  const allListings = [`
);

// Delete the original component export line up to useState
content = content.replace(
  `export default function Marketplace() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');`,
  `  const [searchQuery, setSearchQuery] = useState('');`
);

// String Replacements for Data
// Farmer name
content = content.replaceAll(`'Available Farmer'`, `t('marketplaceContext.farmer')`);

// Locations
content = content.replaceAll(`'Punjab'`, `t('marketplaceContext.locations.punjab')`);
content = content.replaceAll(`'Madhya Pradesh'`, `t('marketplaceContext.locations.mp')`);
content = content.replaceAll(`'Maharashtra'`, `t('marketplaceContext.locations.mh')`);
content = content.replaceAll(`'Uttar Pradesh'`, `t('marketplaceContext.locations.up')`);
content = content.replaceAll(`'Rajasthan'`, `t('marketplaceContext.locations.rj')`);
content = content.replaceAll(`'Telangana'`, `t('marketplaceContext.locations.tl')`);

// Crops
content = content.replaceAll(`'Wheat HD-2967'`, `t('marketplaceContext.crops.wheat1')`);
content = content.replaceAll(`'Wheat PBW-343'`, `t('marketplaceContext.crops.wheat2')`);
content = content.replaceAll(`'Wheat Lok-1'`, `t('marketplaceContext.crops.wheat3')`);
content = content.replaceAll(`'Soybean JS-335'`, `t('marketplaceContext.crops.soybean')`);
content = content.replaceAll(`'Rice Basmati'`, `t('marketplaceContext.crops.rice1')`);
content = content.replaceAll(`'Rice Sona Masoori'`, `t('marketplaceContext.crops.rice2')`);
content = content.replaceAll(`'Mustard Pusa Bold'`, `t('marketplaceContext.crops.mustard')`);
content = content.replaceAll(`'Chickpea Desi'`, `t('marketplaceContext.crops.chickpea')`);

// Categories
content = content.replace(`['All', 'Wheat', 'Rice', 'Mustard', 'Soybean', 'Chickpea']`, `[t('marketplaceContext.categories.all'), t('marketplaceContext.categories.wheat'), t('marketplaceContext.categories.rice'), t('marketplaceContext.categories.mustard'), t('marketplaceContext.categories.soybean'), t('marketplaceContext.categories.chickpea')]`);
content = content.replace(`setSelectedCategory('All')`, `setSelectedCategory(t('marketplaceContext.categories.all'))`);
content = content.replace(`selectedCategory === 'All'`, `selectedCategory === t('marketplaceContext.categories.all')`);
content = content.replace(`useState('All')`, `useState(t('marketplaceContext.categories.all'))`);

// Deep render text
content = content.replace(`>Grade<`, `>{t('marketplaceContext.grade')}<`);
content = content.replace(`>Moisture<`, `>{t('marketplaceContext.moisture')}<`);

// Market insights array
content = content.replaceAll(`crop: 'Wheat'`, `crop: t('marketplaceContext.crops.wheat')`);
content = content.replaceAll(`crop: 'Rice'`, `crop: t('marketplaceContext.crops.rice')`);
content = content.replaceAll(`crop: 'Mustard'`, `crop: t('marketplaceContext.crops.mustard_gen')`);
content = content.replaceAll(`crop: 'Soybean'`, `crop: t('marketplaceContext.crops.soybean_gen')`);

fs.writeFileSync(filepath, content);

// UPDATE EN.JSON
const localesPath = path.join(process.cwd(), 'src', 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(localesPath, 'utf8'));

enData.marketplaceContext = {
  "farmer": "Available Farmer",
  "locations": {
    "punjab": "Punjab",
    "mp": "Madhya Pradesh",
    "mh": "Maharashtra",
    "up": "Uttar Pradesh",
    "rj": "Rajasthan",
    "tl": "Telangana"
  },
  "crops": {
    "wheat1": "Wheat HD-2967",
    "wheat2": "Wheat PBW-343",
    "wheat3": "Wheat Lok-1",
    "soybean": "Soybean JS-335",
    "rice1": "Rice Basmati",
    "rice2": "Rice Sona Masoori",
    "mustard": "Mustard Pusa Bold",
    "chickpea": "Chickpea Desi",
    "wheat": "Wheat",
    "rice": "Rice",
    "mustard_gen": "Mustard",
    "soybean_gen": "Soybean"
  },
  "categories": {
    "all": "All",
    "wheat": "Wheat",
    "rice": "Rice",
    "mustard": "Mustard",
    "soybean": "Soybean",
    "chickpea": "Chickpea"
  },
  "grade": "Grade",
  "moisture": "Moisture"
};

fs.writeFileSync(localesPath, JSON.stringify(enData, null, 2));
console.log('Marketplace patched and en.json updated securely!');
