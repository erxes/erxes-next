import { atom } from 'jotai';
import { Icon, IconProps } from '@tabler/icons-react';

export type PluginsConfig = {
  name: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  haveWidgets: boolean;
  widgetsIcon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<Icon>
  >;
};

export type PluginsConfigState = {
  [key: string]: PluginsConfig;
};

export const pluginsConfigState = atom<PluginsConfigState | null>(null);
