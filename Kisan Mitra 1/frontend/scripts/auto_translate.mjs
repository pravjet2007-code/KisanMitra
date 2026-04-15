import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const languages = ['hi', 'mr', 'pa', 'gu', 'ta', 'te', 'bn'];

async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(x => x[0]).join('');
  } catch (e) {
    console.error(`Translation failed for ${targetLang}:`, e.message);
    return text; // Fallback to english
  }
}

async function traverseAndTranslate(enObj, targetObj, targetLang) {
  const result = { ...targetObj };
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      result[key] = await traverseAndTranslate(enObj[key], targetObj[key] || {}, targetLang);
    } else if (typeof enObj[key] === 'string') {
      // If missing or same as english (meaning it wasn't translated), translate it
      if (!targetObj[key] || targetObj[key] === enObj[key]) {
        console.log(`Translating [${targetLang}] key: ${key}`);
        result[key] = await translateText(enObj[key], targetLang);
        // Small delay to prevent rate limiting
        await new Promise(r => setTimeout(r, 200));
      } else {
        result[key] = targetObj[key];
      }
    }
  }
  return result;
}

async function main() {
  const enPath = path.join(localesDir, 'en.json');
  if (!fs.existsSync(enPath)) {
    console.error('en.json not found');
    return;
  }
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  for (const lang of languages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    let existing = {};
    if (fs.existsSync(filePath)) {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    
    console.log(`\nSyncing translations for ${lang}...`);
    const translated = await traverseAndTranslate(enData, existing, lang);
    fs.writeFileSync(filePath, JSON.stringify(translated, null, 2));
  }
  console.log('\nAll translations synced successfully!');
}

main();
