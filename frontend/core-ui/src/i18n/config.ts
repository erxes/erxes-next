import { initReactI18next } from 'react-i18next';
import i18n, { InitOptions } from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { REACT_APP_API_URL } from 'erxes-ui';

export const defaultI18nOptions: InitOptions = {
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ['en', 'mn'], // Or dynamically get this
  detection: {
    caches: ['cookie', 'localStorage', 'header'],
    lookupCookie: 'lng',
    lookupLocalStorage: 'lng',
    order: ['cookie', 'localStorage', 'header'],
  },
  backend: {
    loadPath: `${REACT_APP_API_URL}/locales/{{lng}}.json`,
  },
  react: {
    useSuspense: true,
  },
};

export const i18nInstance = i18n.createInstance();

// Save selected language
i18nInstance.on('languageChanged', (lng) => {
  localStorage.setItem('lng', lng);
});

const savedLanguage =
  localStorage.getItem('lng') || defaultI18nOptions.fallbackLng;

// Add the backend loader
i18nInstance
  .use(HttpBackend) // ⬅️ Use the backend loader
  .use(initReactI18next)
  .init({
    ...defaultI18nOptions,
    lng: savedLanguage as string,
  });
