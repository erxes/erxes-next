import { createState } from './createState';

export type PluginsMetaData = {
  [key: string]: {
    name: string;
    icon: React.ReactElement;
  };
};

export const pluginsConfigState = createState<PluginsMetaData | null>({
  key: 'pluginsConfigState',
  defaultValue: null,
});
