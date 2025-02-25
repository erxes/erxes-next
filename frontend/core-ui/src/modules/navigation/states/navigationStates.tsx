import { atom } from 'jotai';
import { PLUGINS } from '@/navigation/constants/plugins';

export interface Plugin {
  handle: keyof typeof PLUGINS;
  pinned: boolean;
}

export const pluginsState = atom<Plugin[]>([
  { handle: 'contacts', pinned: true },
  { handle: 'products', pinned: true },
]);
