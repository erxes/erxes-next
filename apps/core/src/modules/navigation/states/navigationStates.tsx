import { atom } from 'recoil';
import { PLUGINS } from '../constants/plugins';

export interface Plugin {
  handle: keyof typeof PLUGINS;
  pinned: boolean;
}

export const pluginsState = atom<Plugin[]>({
  key: 'plugins',
  default: [
    { handle: 'inbox', pinned: true },
    { handle: 'tasks', pinned: true },
    { handle: 'contacts', pinned: true },
    { handle: 'insights', pinned: true },
    { handle: 'products', pinned: true },
    { handle: 'sales', pinned: true },
  ],
});
