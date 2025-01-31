import { createState } from './createState';

export type PluginsConfig = {
  name: string;
  icon: React.ReactElement;
};

export type PluginsConfigState = {
  [key: string]: PluginsConfig;
};

export const pluginsConfigState = createState<PluginsConfigState | null>({
  key: 'pluginsConfigState',
  defaultValue: null,
});
