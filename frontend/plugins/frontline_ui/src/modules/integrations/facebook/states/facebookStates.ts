import { atom } from 'jotai';

export const selectedFacebookAccountAtom = atom<string | undefined>(undefined);
export const selectedFacebookPageAtom = atom<string | undefined>(undefined);
export const activeFacebookMessengerAddStepAtom = atom<number>(1);
