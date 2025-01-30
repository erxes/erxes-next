import { atom } from 'recoil';

export const ProductFieldEditLoadingAtom = atom<boolean>({
  key: 'loadingState',
  default: false,
});
