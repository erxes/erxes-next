import { atom } from 'jotai';

export interface Plugin {
  handle: string;
  pinned: boolean;
}

export const pluginsState = atom<Plugin[]>([
  { handle: 'contacts', pinned: true },
  { handle: 'products', pinned: true },
]);
