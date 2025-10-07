import { SocialPlatform } from '@/integrations/erxes-messenger/types/EMStateTypes';

export const STORAGE_KEYS = {
  SETUP_STEP: 'erxesMessengerSetupStep',
  APPEARANCE: 'erxesMessengerSetupAppearance',
  GREETING: 'erxesMessengerSetupGreeting',
  INTRO: 'erxesMessengerSetupIntro',
  HOURS: 'erxesMessengerSetupHours',
  SETTINGS: 'erxesMessengerSetupSettings',
  CONFIG: 'erxesMessengerSetupConfig',
} as const;

export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  'youtube.com': 'youtube',
  'facebook.com': 'facebook',
  'instagram.com': 'instagram',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
} as const;

export const DEFAULT_COLORS = {
  DEFAULT: '#5048e5',
  foreground: '#ffffff',
} as const;

export const DEFAULT_LANGUAGE = 'en_US';
export const DEFAULT_WALLPAPER = '1';
