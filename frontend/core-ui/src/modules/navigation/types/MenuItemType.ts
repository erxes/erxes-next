import { Icon } from '@tabler/icons-react';

export interface MenuItem {
  name: string;
  icon: Icon;
  path: string;
  submenus: { name: string; path: string }[];
}
