import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';
import {BookOpenCheck} from 'lucide-react';

export const CONFIG: IUIConfig = {
  name: 'content',
  icon: IconSandbox,
  modules: [
    {
      name: 'knowledgebase',
      icon: BookOpenCheck,
      path: 'knowledgebase',
      hasSettings: false,
      hasWidgets: false,
    },
    {
      name: 'contentSecond',
      icon: IconSandbox,
      path: 'contentSecond',
      hasSettings: true,
      hasWidgets: true,
      submenus: [
        {
          name: 'submenu1',
          path: 'contentSecond/submenu1',
        },
        {
          name: 'submenu2',
          path: 'contentSecond/submenu2',
        },
      ],
    },
  ],
};
