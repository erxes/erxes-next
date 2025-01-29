import { atom } from 'recoil';

export const CustomerFieldEditLoadingAtom = atom<boolean>({
  key: 'loadingState',
  default: false,
});
