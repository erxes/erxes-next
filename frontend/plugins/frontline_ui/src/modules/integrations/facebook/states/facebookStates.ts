import { atom } from 'jotai';

export const facebookAddSheetAtom = atom(false);
export const selectedFacebookAccountAtom = atom<string | undefined>(undefined);
export const selectedFacebookPageAtom = atom<string | undefined>(undefined);
export const activeFacebookMessengerAddStepAtom = atom<number>(1);

export const resetFacebookAddStateAtom = atom(null, (get, set) => {
  set(facebookAddSheetAtom, false);
  set(selectedFacebookAccountAtom, undefined);
  set(selectedFacebookPageAtom, undefined);
  set(activeFacebookMessengerAddStepAtom, 1);
});
