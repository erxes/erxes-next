import { atomFamily } from 'recoil';

export const hideChildrenAtomFamily = atomFamily<boolean, string>({
  key: 'hideChildrenAtomFamily',
  default: false,
});
