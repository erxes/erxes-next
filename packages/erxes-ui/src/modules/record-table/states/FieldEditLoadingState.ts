import { atom } from 'recoil';

export const FieldEditLoadingAtom = atom<boolean>({
  key: 'loadingState',
  default: false,
});
