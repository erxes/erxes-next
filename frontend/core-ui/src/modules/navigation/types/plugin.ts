import { Icon } from '@tabler/icons-react';

export interface Plugin {
  path: string;
  name: string;
  icon:Icon;
  submenus?: { name: string; path: string }[];
}
