import fs from 'fs';
import path from 'path';

const translations = {
  en: {
    farmerDash: {
      title: "Farmer Dashboard",
      setupProfile: "Setup Your Farm Profile",
      newListing: "New Listing",
      tabs: {
        overview: "Overview", soil: "Soil Health", pest: "Pest Monitor",
        drone: "Drone Scan", market: "Marketplace", transactions: "Transactions", profile: "Profile"
      }
    },
    buyerDash: {
      title: "Buyer Dashboard",
      setupProfile: "Business Onboarding",
      findSupply: "Find Supply",
      tabs: {
        overview: "Overview", forecast: "Supply Forecast", listings: "Browse Listings",
        orders: "Orders", analytics: "Analytics", traceability: "Traceability", profile: "Profile"
      }
    }
  },
  hi: {
    farmerDash: {
      title: "किसान डैशबोर्ड",
      setupProfile: "अपनी कृषि प्रोफ़ाइल सेट करें",
      newListing: "नई सूची",
      tabs: {
        overview: "अवलोकन", soil: "मिट्टी का स्वास्थ्य", pest: "कीट मॉनिटर",
        drone: "ड्रोन स्कैन", market: "बाज़ार", transactions: "लेन-देन", profile: "प्रोफ़ाइल"
      }
    },
    buyerDash: {
      title: "खरीदार डैशबोर्ड",
      setupProfile: "व्यवसाय ऑनबोर्डिंग",
      findSupply: "आपूर्ति खोजें",
      tabs: {
        overview: "अवलोकन", forecast: "आपूर्ति पूर्वानुमान", listings: "सूचियां ब्राउज़ करें",
        orders: "ऑर्डर", analytics: "एनालिटिक्स", traceability: "ट्रेसेबिलिटी", profile: "प्रोफ़ाइल"
      }
    }
  },
  mr: {
    farmerDash: {
      title: "शेतकरी डॅशबोर्ड",
      setupProfile: "तुमचे शेती प्रोफाइल सेट करा",
      newListing: "नवीन सूची",
      tabs: {
        overview: "आढावा", soil: "मातीचे आरोग्य", pest: "कीटक मॉनिटर",
        drone: "ड्रोन स्कॅन", market: "बाजारपेठ", transactions: "व्यवहार", profile: "प्रोफाइल"
      }
    },
    buyerDash: {
      title: "खरेदीदार डॅशबोर्ड",
      setupProfile: "व्यवसाय ऑनबोर्डिंग",
      findSupply: "पुरवठा शोधा",
      tabs: {
        overview: "आढावा", forecast: "पुरवठा अंदाज", listings: "याद्या ब्राउझ करा",
        orders: "ऑर्डर्स", analytics: "विश्लेषण", traceability: "शोधता", profile: "प्रोफाइल"
      }
    }
  },
  pa: {
    farmerDash: {
      title: "ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ",
      setupProfile: "ਆਪਣੀ ਫਾਰਮ ਪ੍ਰੋਫਾਈਲ ਸੈਟਅਪ ਕਰੋ",
      newListing: "ਨਵੀਂ ਸੂਚੀ",
      tabs: {
        overview: "ਸੰਖੇਪ ਜਾਣਕਾਰੀ", soil: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ", pest: "ਕੀੜੇ ਮਾਨੀਟਰ",
        drone: "ਡਰੋਨ ਸਕੈਨ", market: "ਬਾਜ਼ਾਰ", transactions: "ਲੈਣ-ਦੇਣ", profile: "ਪ੍ਰੋਫਾਈਲ"
      }
    },
    buyerDash: {
      title: "ਖਰੀਦਦਾਰ ਡੈਸ਼ਬੋਰਡ",
      setupProfile: "ਕਾਰੋਬਾਰੀ ਆਨਬੋਰਡਿੰਗ",
      findSupply: "ਸਪਲਾਈ ਲੱਭੋ",
      tabs: {
        overview: "ਸੰਖੇਪ ਜਾਣਕਾਰੀ", forecast: "ਸਪਲਾਈ ਪੂਰਵ ਅਨੁਮਾਨ", listings: "ਸੂਚੀਆਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ",
        orders: "ਆਰਡਰ", analytics: "ਵਿਸ਼ਲੇਸ਼ਣ", traceability: "ਟਰੇਸੇਬਿਲਟੀ", profile: "ਪ੍ਰੋਫਾਈਲ"
      }
    }
  },
  gu: {
    farmerDash: {
      title: "ખેડૂત ડેશબોર્ડ",
      setupProfile: "તમારી ફાર્મ પ્રોફાઇલ સેટઅપ કરો",
      newListing: "નવી સૂચિ",
      tabs: {
        overview: "ઝાંખી", soil: "માટીનું આરોગ્ય", pest: "જીવાત મોનિટર",
        drone: "ડ્રોન સ્કેન", market: "માર્કેટપ્લેસ", transactions: "વ્યવહારો", profile: "પ્રોફાઇલ"
      }
    },
    buyerDash: {
      title: "ખરીદનાર ડેશબોર્ડ",
      setupProfile: "વ્યવસાય ઓનબોર્ડિંગ",
      findSupply: "પુરવઠો શોધો",
      tabs: {
        overview: "ઝાંખી", forecast: "પુરવઠા આગાહી", listings: "સૂચિઓ બ્રાઉઝ કરો",
        orders: "ઓર્ડર", analytics: "એનાલિટિક્સ", traceability: "ટ્રેસેબિલિટી", profile: "પ્રોફાઇલ"
      }
    }
  },
  ta: {
    farmerDash: {
      title: "உழவர் டாஷ்போர்டு",
      setupProfile: "உங்கள் பண்ணை சுயவிவரத்தை அமைக்கவும்",
      newListing: "புதிய பட்டியல்",
      tabs: {
        overview: "கண்ணோட்டம்", soil: "மண் வளம்", pest: "பூச்சி கண்காணிப்பு",
        drone: "ட்ரோன் ஸ்கேன்", market: "சந்தை", transactions: "பரிவர்த்தனைகள்", profile: "சுயவிவரம்"
      }
    },
    buyerDash: {
      title: "வாங்குபவர் டாஷ்போர்டு",
      setupProfile: "வணிக ஆன்போர்டிங்",
      findSupply: "விநியோகத்தைக் கண்டறியவும்",
      tabs: {
        overview: "கண்ணோட்டம்", forecast: "விநியோக முன்கணிப்பு", listings: "பட்டியல்களை உலாவுக",
        orders: "ஆர்டர்கள்", analytics: "பகுப்பாய்வு", traceability: "கண்காணிப்பு", profile: "சுயவிவரம்"
      }
    }
  },
  te: {
    farmerDash: {
      title: "రైతు డాష్‌బోర్డ్",
      setupProfile: "మీ వ్యవసాయ ప్రొఫైల్‌ను సెటప్ చేయండి",
      newListing: "కొత్త జాబితా",
      tabs: {
        overview: "స్థూలదృష్టి", soil: "నేల ఆరోగ్యం", pest: "తెగులు మానిటర్",
        drone: "డ్రోన్ స్కాన్", market: "మార్కెట్ ప్లేస్", transactions: "లావాదేవీలు", profile: "ప్రొఫైల్"
      }
    },
    buyerDash: {
      title: "కొనుగోలుదారు డాష్‌బోర్డ్",
      setupProfile: "వ్యాపార ఆన్‌బోర్డింగ్",
      findSupply: "సరఫరాను కనుగొనండి",
      tabs: {
        overview: "స్థూలదృష్టి", forecast: "సరఫరా సూచన", listings: "జాబితాలను బ్రౌజ్ చేయండి",
        orders: "ఆదేశాలు", analytics: "విశ్లేషణలు", traceability: "జాడ", profile: "ప్రొఫైల్"
      }
    }
  },
  bn: {
    farmerDash: {
      title: "কৃষক ড্যাশবোর্ড",
      setupProfile: "আপনার খামার প্রোফাইল সেট আপ করুন",
      newListing: "নতুন তালিকা",
      tabs: {
        overview: "ওভারভিউ", soil: "মাটির স্বাস্থ্য", pest: "কীটপতঙ্গ মনিটর",
        drone: "ড্রোন স্ক্যান", market: "মার্কেটপ্লেস", transactions: "লেনদেন", profile: "প্রোফাইল"
      }
    },
    buyerDash: {
      title: "ক্রেতা ড্যাশবোর্ড",
      setupProfile: "ব্যবসা অনবোর্ডিং",
      findSupply: "সরবরাহ খুঁজুন",
      tabs: {
        overview: "ওভারভিউ", forecast: "সরবরাহের পূর্বাভাস", listings: "তালিকা ব্রাউজ করুন",
        orders: "অর্ডার", analytics: "অ্যানালিটিক্স", traceability: "ট্রেসেবিলিটি", profile: "প্রোফাইল"
      }
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
  
  existing.farmerDash = data.farmerDash;
  existing.buyerDash = data.buyerDash;
  
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}

console.log('Dashboards translations appended successfully.');
