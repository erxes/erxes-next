import { atom } from 'recoil';
import { PLUGINS } from '../constants/plugins';

export interface Plugin {
  handle: keyof typeof PLUGINS;
  pinned: boolean;
}

export const pluginsState = atom<Plugin[]>({
  key: 'plugins',
  default: [
    { handle: 'contacts', pinned: true },
    { handle: 'products', pinned: true },
  ],
});
