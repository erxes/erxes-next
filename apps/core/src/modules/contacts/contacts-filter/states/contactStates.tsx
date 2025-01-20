import { atom } from 'recoil';

export const contactDateFilterOpenAtom = atom<string>({
  key: 'contactDateFilterOpenAtom',
  default: '',
});
