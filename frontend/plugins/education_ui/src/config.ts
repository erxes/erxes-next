import { IconBook, IconSchool } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'education',
  icon: IconBook,
  modules: [
    {
      name: 'courses',
      icon: IconBook,
      path: 'education/courses',
      hasSettings: false,
      hasWidgets: false,
    },
    {
      name: 'class',
      icon: IconSchool,
      path: 'education/class',
      hasSettings: false,
      hasWidgets: false,
    },
  ],
};
