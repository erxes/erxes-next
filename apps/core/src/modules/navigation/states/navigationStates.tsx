import { atom } from 'recoil';

export interface Plugin {
  key: string;
  pinned: boolean;
}

export const plugins = atom<Plugin[]>({
  key: 'plugins',
  default: [],
});
