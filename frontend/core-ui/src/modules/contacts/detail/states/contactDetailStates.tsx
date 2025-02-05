import { atom } from 'recoil';

export const renderingContactDetailAtom = atom<boolean>({
  key: 'renderingContactDetailAtom',
  default: false,
});

export const contactDetailActiveActionTabAtom = atom<string>({
  key: 'contactDetailActiveActionTabAtom',
  default: '',
});
