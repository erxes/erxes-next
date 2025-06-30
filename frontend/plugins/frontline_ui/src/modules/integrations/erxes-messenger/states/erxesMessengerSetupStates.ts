import { atomWithStorage } from 'jotai/utils';

export const erxesMessengerSetupAppearanceAtom = atomWithStorage<
  { brandColor?: string; logo?: string } | undefined
>('erxesMessengerSetupAppearance', undefined);

export const erxesMessengerSetupGreetingAtom = atomWithStorage<
  | {
      title?: string;
      message?: string;
      supporterUsers?: string[];
      links?: { url: string }[];
    }
  | undefined
>('erxesMessengerSetupGreeting', undefined);

export const erxesMessengerSetupStepAtom = atomWithStorage<number>(
  'erxesMessengerSetupStep',
  1,
);
