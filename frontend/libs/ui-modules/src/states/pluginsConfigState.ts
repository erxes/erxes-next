import { atomWithStorage } from 'jotai/utils';
import { IUIConfig } from 'erxes-ui';

export type PluginsConfigState = {
  [key: string]: IUIConfig;
};

export const pluginsConfigState = atomWithStorage<PluginsConfigState | null>(
  'pluginsConfigState',
  null,
  undefined,
  { getOnInit: true },
);
