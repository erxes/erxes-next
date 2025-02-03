import type { Locale } from 'date-fns';

import enUS from './translations/en.json';
import mn from './translations/mn.json';

export const resources = [
  {
    translation: enUS,
  },
  {
    translation: mn,
  },
] as const;

export type Resources = typeof resources;

export type Language = {
  code: string;
  display_name: string;
  ltr: boolean;
  date_locale: Locale;
};
