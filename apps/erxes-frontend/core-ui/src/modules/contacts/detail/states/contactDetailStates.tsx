import { atom } from 'recoil';

export const renderingContactDetailAtom = atom<boolean>({
  key: 'renderingContactDetailAtom',
  default: false,
});
