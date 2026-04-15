import fs from 'fs';
import path from 'path';

const translations = {
  en: {
    marketplace: {
      title: "KISAN MITRA Marketplace",
      subtitle: "Browse verified farm listings with quality data, drone maps, and Farmer Score.",
      searchPlaceholder: "Search crops, locations...",
      filters: "Filters",
      priceLow: "Price: Low → High",
      priceHigh: "Price: High → Low",
      scoreTitle: "Farmer Score",
      distance: "Distance",
      anyScore: "Any Score",
      listings: "listings",
      noListingsTitle: "No listings found",
      noListingsDesc: "Adjust your filters or search query.",
      marketInsights: "Market Insights"
    }
  },
  hi: {
    marketplace: {
      title: "किसान मित्रा बाज़ार",
      subtitle: "गुणवत्ता डेटा, ड्रोन मैप और किसान स्कोर के साथ सत्यापित कृषि सूची ब्राउज़ करें।",
      searchPlaceholder: "फसलें, स्थान खोजें...",
      filters: "फ़िल्टर",
      priceLow: "कीमत: कम → ज्यादा",
      priceHigh: "कीमत: ज्यादा → कम",
      scoreTitle: "किसान स्कोर",
      distance: "दूरी",
      anyScore: "कोई भी स्कोर",
      listings: "सूचियां",
      noListingsTitle: "कोई सूची नहीं मिली",
      noListingsDesc: "अपने फ़िल्टर या खोज क्वेरी को समायोजित करें।",
      marketInsights: "बाज़ार अंतर्दृष्टि"
    }
  },
  mr: {
    marketplace: {
      title: "किसान मित्रा बाजारपेठ",
      subtitle: "गुणवत्ता डेटा, ड्रोन नकाशे आणि शेतकरी स्कोअरसह सत्यापित शेती सूची ब्राउझ करा.",
      searchPlaceholder: "पिके, ठिकाणे शोधा...",
      filters: "फिल्टर",
      priceLow: "किंमत: कमी → जास्त",
      priceHigh: "किंमत: जास्त → कमी",
      scoreTitle: "शेतकरी स्कोअर",
      distance: "अंतर",
      anyScore: "कोणताही स्कोअर",
      listings: "याद्या",
      noListingsTitle: "कोणतीही सूची आढळली नाही",
      noListingsDesc: "तुमचे फिल्टर किंवा शोध क्वेरी समायोजित करा.",
      marketInsights: "बाजार अंतर्दृष्टी"
    }
  },
  pa: {
    marketplace: {
      title: "ਕਿਸਾਨ ਮਿੱਤਰਾ ਬਾਜ਼ਾਰ",
      subtitle: "ਗੁਣਵੱਤਾ ਡੇਟਾ, ਡਰੋਨ ਨਕਸ਼ੇ ਅਤੇ ਕਿਸਾਨ ਸਕੋਰ ਦੇ ਨਾਲ ਤਸਦੀਕਸ਼ੁਦਾ ਖੇਤੀ ਸੂਚੀਆਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ।",
      searchPlaceholder: "ਫਸਲਾਂ, ਸਥਾਨ ਖੋਜੋ...",
      filters: "ਫਿਲਟਰ",
      priceLow: "ਕੀਮਤ: ਘੱਟ → ਵੱਧ",
      priceHigh: "ਕੀਮਤ: ਵੱਧ → ਘੱਟ",
      scoreTitle: "ਕਿਸਾਨ ਸਕੋਰ",
      distance: "ਦੂਰੀ",
      anyScore: "ਕੋਈ ਵੀ ਸਕੋਰ",
      listings: "ਸੂਚੀਆਂ",
      noListingsTitle: "ਕੋਈ ਸੂਚੀ ਨਹੀਂ ਮਿਲੀ",
      noListingsDesc: "ਆਪਣੇ ਫਿਲਟਰ ਜਾਂ ਖੋਜ ਸਵਾਲ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰੋ।",
      marketInsights: "ਬਾਜ਼ਾਰ ਦੀ ਜਾਣਕਾਰੀ"
    }
  },
  gu: {
    marketplace: {
      title: "કિસાન મિત્રા માર્કેટપ્લેસ",
      subtitle: "ગુણવત્તા ડેટા, ડ્રોન નકશા અને ખેડૂત સ્કોર સાથે ચકાસાયેલ કૃષિ સૂચિઓ બ્રાઉઝ કરો.",
      searchPlaceholder: "પાક, સ્થાનો શોધો...",
      filters: "ફિલ્ટર્સ",
      priceLow: "કિંમત: ઓછી → વધુ",
      priceHigh: "કિંમત: વધુ → ઓછી",
      scoreTitle: "ખેડૂત સ્કોર",
      distance: "અંતર",
      anyScore: "કોઈપણ સ્કોર",
      listings: "સૂચિઓ",
      noListingsTitle: "કોઈ સૂચિ મળી નથી",
      noListingsDesc: "તમારા ફિલ્ટર્સ અથવા શોધ ક્વેરીને સમાયોજિત કરો.",
      marketInsights: "માર્કેટ ઇનસાઇટ્સ"
    }
  },
  ta: {
    marketplace: {
      title: "கிசான் மித்ரா சந்தை",
      subtitle: "தரமான தரவு, ட்ரோன் வரைபடங்கள் மற்றும் உழவர் மதிப்பெண் ஆகியவற்றுடன் சரிபார்க்கப்பட்ட பண்ணை பட்டியல்களை உலாவுக.",
      searchPlaceholder: "பயிர்கள், இடங்களை தேடுங்கள்...",
      filters: "வடிப்பான்கள்",
      priceLow: "விலை: குறைவு → அதிகம்",
      priceHigh: "விலை: அதிகம் → குறைவு",
      scoreTitle: "உழவர் மதிப்பெண்",
      distance: "தூரம்",
      anyScore: "எந்த மதிப்பெண்ணும்",
      listings: "பட்டியல்கள்",
      noListingsTitle: "பட்டியல்கள் எதுவும் கண்டறியப்படவில்லை",
      noListingsDesc: "உங்கள் வடிப்பான்கள் அல்லது தேடலைச் சரிசெய்யவும்.",
      marketInsights: "சந்தை நுண்ணறிவு"
    }
  },
  te: {
    marketplace: {
      title: "కిసాన్ మిత్ర మార్కెట్ ప్లేస్",
      subtitle: "నాణ్యత డేటా, డ్రోన్ మ్యాప్‌లు మరియు రైతు స్కోర్‌తో ధృవీకరించబడిన వ్యవసాయ జాబితాలను బ్రౌజ్ చేయండి.",
      searchPlaceholder: "పంటలు, స్థానాలను శోధించండి...",
      filters: "ఫిల్టర్లు",
      priceLow: "ధర: తక్కువ → ఎక్కువ",
      priceHigh: "ధర: ఎక్కువ → తక్కువ",
      scoreTitle: "రైతు స్కోర్",
      distance: "దూరం",
      anyScore: "ఏదైనా స్కోర్",
      listings: "జాబితాలు",
      noListingsTitle: "జాబితాలు కనుగొనబడలేదు",
      noListingsDesc: "మీ ఫిల్టర్‌లు లేదా శోధన ప్రశ్నను సర్దుబాటు చేయండి.",
      marketInsights: "మార్కెట్ అంతర్దృష్టులు"
    }
  },
  bn: {
    marketplace: {
      title: "কিসান মিত্র মার্কেটপ্লেস",
      subtitle: "মানের ডেটা, ড্রোন মানচিত্র এবং কৃষক স্কোর সহ যাচাইকৃত খামার তালিকাগুলি ব্রাউজ করুন।",
      searchPlaceholder: "ফসল, অবস্থান অনুসন্ধান করুন...",
      filters: "ফিল্টার",
      priceLow: "দাম: কম → বেশি",
      priceHigh: "দাম: বেশি → কম",
      scoreTitle: "কৃষক স্কোর",
      distance: "দূরত্ব",
      anyScore: "যেকোনো স্কোর",
      listings: "তালিকা",
      noListingsTitle: "কোনো তালিকা পাওয়া যায়নি",
      noListingsDesc: "আপনার ফিল্টার বা অনুসন্ধান ক্যোয়ারী সামঞ্জস্য করুন।",
      marketInsights: "মার্কেট ইনসাইটস"
    }
  }
};

const localesDir = path.join(process.cwd(), 'src', 'locales');

for (const [lang, data] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  let existing = {};
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  
  existing.marketplace = data.marketplace;
  
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}

console.log('Marketplace translations appended successfully.');
