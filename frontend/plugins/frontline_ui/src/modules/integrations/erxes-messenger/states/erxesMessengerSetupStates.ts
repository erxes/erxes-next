import { EMAPPEARANCE_SCHEMA } from '@/integrations/erxes-messenger/constants/emAppearanceSchema';
import { EM_CONFIG_SCHEMA } from '@/integrations/erxes-messenger/constants/emConfigSchema';
import { EMGREETING_SCHEMA } from '@/integrations/erxes-messenger/constants/emGreetingSchema';
import { EMHOURS_SCHEMA } from '@/integrations/erxes-messenger/constants/emHoursSchema';
import { EMINTRO_SCHEMA } from '@/integrations/erxes-messenger/constants/emIntroSchema';
import { EM_SETTINGS_SCHEMA } from '@/integrations/erxes-messenger/constants/emSettingsSchema';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { z } from 'zod';

export const erxesMessengerSetupStepAtom = atomWithStorage<number>(
  'erxesMessengerSetupStep',
  1,
);

export const erxesMessengerSetupSheetOpenAtom = atom(false);

//steps

export const erxesMessengerSetupAppearanceAtom = atomWithStorage<z.infer<
  typeof EMAPPEARANCE_SCHEMA
> | null>('erxesMessengerSetupAppearance', null);

export const erxesMessengerSetupGreetingAtom = atomWithStorage<z.infer<
  typeof EMGREETING_SCHEMA
> | null>('erxesMessengerSetupGreeting', null);

export const erxesMessengerSetupIntroAtom = atomWithStorage<z.infer<
  typeof EMINTRO_SCHEMA
> | null>('erxesMessengerSetupIntro', null);

export const erxesMessengerSetupHoursAtom = atomWithStorage<z.infer<
  typeof EMHOURS_SCHEMA
> | null>('erxesMessengerSetupHours', null);

export const erxesMessengerSetupSettingsAtom = atomWithStorage<z.infer<
  typeof EM_SETTINGS_SCHEMA
> | null>('erxesMessengerSetupSettings', null);

export const erxesMessengerSetupConfigAtom = atomWithStorage<z.infer<
  typeof EM_CONFIG_SCHEMA
> | null>('erxesMessengerSetupConfig', null);

export const resetErxesMessengerSetupAtom = atom(null, (_, set) => {
  set(erxesMessengerSetupAppearanceAtom, null);
  set(erxesMessengerSetupGreetingAtom, null);
  set(erxesMessengerSetupIntroAtom, null);
  set(erxesMessengerSetupHoursAtom, null);
  set(erxesMessengerSetupSettingsAtom, null);
  set(erxesMessengerSetupConfigAtom, null);
  set(erxesMessengerSetupStepAtom, 1);
  set(erxesMessengerSetupSheetOpenAtom, false);
});

export const erxesMessengerCreateAtom = atom((get) => {
  const appearance = get(erxesMessengerSetupAppearanceAtom);
  const greeting = get(erxesMessengerSetupGreetingAtom);
  const intro = get(erxesMessengerSetupIntroAtom);
  const hours = get(erxesMessengerSetupHoursAtom);
  const settings = get(erxesMessengerSetupSettingsAtom);

  const { socialLinks: links, externalLinks } = processLinks(greeting?.links);

  return (config: z.infer<typeof EM_CONFIG_SCHEMA>) => ({
    createVariables: {
      name: config?.integrationName,
      brandId: config?.brandId,
      languageCode: settings?.defaultLanguage,
      channelIds: config?.channelIds,
    },
    saveConfigVariables: {
      messengerData: {
        notifyCustomer: settings?.notifyCustomer,
        botEndpointUrl: '',
        botShowInitialMessage: false,
        botCheck: false,
        botGreetMessage: config?.botSetup?.greetingMessage,
        persistentMenus: config?.botSetup?.persistentMenu,
        availabilityMethod: hours?.availabilitySwitchType,
        isOnline: hours?.isOnline,
        timezone: hours?.timezone,
        responseRate: hours?.responseRate,
        showTimezone: hours?.displayOperatorTimezone,
        onlineHours: Object.entries(hours?.onlineHours || {})
          .filter(([_, hour]) => hour.work)
          .map(([day, { work, ...value }]) => ({
            _id: day,
            day,
            ...value,
          })),
        supporterIds: greeting?.supporterUsers || [],
        messages: {
          [settings?.defaultLanguage || 'en_US']: {
            greetings: {
              title: greeting?.title,
              message: greeting?.message,
            },
            welcome: intro?.welcomeMessage,
            away: intro?.awayMessage,
            thank: intro?.thankyouMessage,
          },
        },
        requireAuth: settings?.requireAuthentication,
        showChat: settings?.showChat,
        showLauncher: settings?.showLauncher,
        hideWhenOffline: false,
        forceLogoutWhenResolve: settings?.forceLogout,
        showVideoCallRequest: settings?.showVideoCallRequest,
        links,
        externalLinks,
      },
      callData: {},
    },
    uiOptions: {
      color: appearance?.brandColor || '#000',
      textColor: appearance?.textColor || '#fff',
      wallpaper: '1',
      logo: appearance?.logo || '',
    },
  });
});

// Types
interface Link {
  url: string;
}

type SocialPlatform = 'youtube' | 'facebook' | 'instagram' | 'twitter';

type SocialLinks = Record<SocialPlatform, string>;

interface ProcessedLinks {
  socialLinks: Partial<SocialLinks>;
  externalLinks: Link[];
}

// Helper function to normalize hostname
const normalizeHostname = (url: string): string | null => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

// Social media platform mapping
const socialPlatforms: Record<string, SocialPlatform> = {
  'youtube.com': 'youtube',
  'facebook.com': 'facebook',
  'instagram.com': 'instagram',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
} as const;

const processLinks = (links?: Link[]): ProcessedLinks => {
  const socialLinks: Partial<SocialLinks> = {};
  const externalLinks: Link[] = [];

  if (!links) return { socialLinks, externalLinks };

  for (const link of links) {
    const hostname = normalizeHostname(link.url);
    const platform = hostname && socialPlatforms[hostname];

    if (platform) {
      socialLinks[platform] = link.url;
    } else {
      externalLinks.push({ url: link.url });
    }
  }

  return { socialLinks, externalLinks };
};
