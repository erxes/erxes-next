import { atomFamily } from 'recoil';

export const hideChildrenAtomFamily = atomFamily<string[], string>({
  key: 'hideChildrenAtomFamily',
  default: [],
});
