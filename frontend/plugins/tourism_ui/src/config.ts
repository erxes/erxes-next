import { IconBox, IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';

export const CONFIG: IUIConfig = {
  name: 'tourism',
  icon: IconSandbox,
  modules: [
    {
      name: 'pms',
      icon: IconSandbox,
      path: 'pms',
      hasSettings: true,
      hasRelationWidget: true,
    },
    {
      name: 'tms',
      icon: IconBox,
      path: 'tms',
      hasSettings: true,
      hasRelationWidget: true,
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
