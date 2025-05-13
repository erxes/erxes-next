import { IconBook, IconCategoryFilled, IconSchool } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'education',
  icon: IconBook,
  modules: [
    {
      name: 'courses',
      icon: IconBook,
      path: 'courses',
      hasSettings: false,
      hasWidgets: false,
      submenus: [
        {
          name: 'category',
          path: 'courses/course-category',
          icon: IconCategoryFilled,
        },
      ],
    },
    {
      name: 'classes',
      icon: IconSchool,
      path: 'classes',
      hasSettings: false,
      hasWidgets: false,
    },
  ],
};
