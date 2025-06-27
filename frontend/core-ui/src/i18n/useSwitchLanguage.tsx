import { i18nInstance } from './config';
import languages from './translations';

export type AvailableLanguage = keyof typeof languages;

export const useSwitchLanguage = () => {
  return {
    currentLanguage: i18nInstance.language,
    languages: Object.keys(languages),
    switchLanguage: (languageId: AvailableLanguage) =>
      i18nInstance.changeLanguage(languageId),
  };
};
