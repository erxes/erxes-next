import { atom } from 'jotai';
import { UIConfig } from 'erxes-ui';

export type PluginsConfigState = {
  [key: string]: UIConfig;
};

export const pluginsConfigState = atom<PluginsConfigState | null>(null);
