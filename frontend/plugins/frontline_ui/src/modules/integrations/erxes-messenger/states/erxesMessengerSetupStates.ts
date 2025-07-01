import { EMGREETING_SCHEMA } from '@/integrations/erxes-messenger/constants/emGreetingSchema';
import { EMINTRO_SCHEMA } from '@/integrations/erxes-messenger/constants/emIntroSchema';
import { atomWithStorage } from 'jotai/utils';
import { z } from 'zod';

export const erxesMessengerSetupAppearanceAtom = atomWithStorage<
  { brandColor?: string; logo?: string } | undefined
>('erxesMessengerSetupAppearance', undefined);

export const erxesMessengerSetupGreetingAtom = atomWithStorage<
  z.infer<typeof EMGREETING_SCHEMA> | undefined
>('erxesMessengerSetupGreeting', undefined);

export const erxesMessengerSetupIntroAtom = atomWithStorage<
  z.infer<typeof EMINTRO_SCHEMA> | undefined
>('erxesMessengerSetupIntro', undefined);

export const erxesMessengerSetupStepAtom = atomWithStorage<number>(
  'erxesMessengerSetupStep',
  1,
);
