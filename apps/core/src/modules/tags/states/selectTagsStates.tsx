import { atom } from 'recoil';

export const newTagNameAtom = atom<string>({
  key: 'newTagNameAtom',
  default: '',
});
