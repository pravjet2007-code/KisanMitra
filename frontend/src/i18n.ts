import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import mrTranslation from './locales/mr.json';
import paTranslation from './locales/pa.json';
import guTranslation from './locales/gu.json';
import taTranslation from './locales/ta.json';
import teTranslation from './locales/te.json';
import bnTranslation from './locales/bn.json';

import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  mr: { translation: mrTranslation },
  pa: { translation: paTranslation },
  gu: { translation: guTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation },
  bn: { translation: bnTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
