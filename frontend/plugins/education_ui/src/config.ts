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
      name: 'classes',
      icon: IconSchool,
      path: 'education/classes',
      hasSettings: false,
      hasWidgets: false,
    },
  ],
};
