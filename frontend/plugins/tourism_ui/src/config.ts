import { IconBox, IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'tourism',
  icon: IconSandbox,
  modules: [
    {
      name: 'pms',
      icon: IconSandbox,
      path: 'pms',
      hasSettings: true,
      hasWidgets: true,
    },
    {
      name: 'tms',
      icon: IconBox,
      path: 'tms',
      hasSettings: true,
      hasWidgets: true,
      // submenus: [
      //   {
      //     name: 'submenu1',
      //     path: 'TMS',
      //   },
      //   {
      //     name: 'submenu2',
      //     path: 'TMS/submenu2',
      //   },
      // ],
    },
  ],
};
