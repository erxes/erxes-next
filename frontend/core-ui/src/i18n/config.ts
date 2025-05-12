import { initReactI18next } from 'react-i18next';

import i18n, { InitOptions } from 'i18next';

import translations from './translations';

export const defaultI18nOptions: InitOptions = {
  // debug: process.env.NODE_ENV === 'development',
  detection: {
    caches: ['cookie', 'localStorage', 'header'],
    lookupCookie: 'lng',
    lookupLocalStorage: 'lng',
    order: ['cookie', 'localStorage', 'header'],
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: translations,
  supportedLngs: Object.keys(translations),
  react: {
    useSuspense: true,
  },
};

export const i18nInstance = i18n.createInstance();

// Add a listener to save the chosen language to localStorage
i18nInstance.on('languageChanged', (lng) => {
  localStorage.setItem('lng', lng);
});

// Initialize i18n with the language from localStorage if available
const savedLanguage = localStorage.getItem('lng');
i18nInstance.use(initReactI18next).init({
  ...defaultI18nOptions,
  lng: savedLanguage || (defaultI18nOptions.fallbackLng as string),
});
