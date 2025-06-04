import {
  IconBook,
  IconBooks,
  IconCategoryFilled,
  IconMan,
  IconSchool,
  IconUser,
} from '@tabler/icons-react';
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
        {
          name: 'students',
          path: 'courses/students',
          icon: IconMan,
        },
        {
          name: 'parents',
          path: 'courses/parents',
          icon: IconUser,
        },
      ],
    },
    {
      name: 'classes',
      icon: IconBooks,
      path: 'classes',
      hasSettings: false,
      hasWidgets: false,
    },
    {
      name: 'teachers',
      icon: IconSchool,
      path: 'teachers',
      hasSettings: false,
      hasWidgets: false,
    },
  ],
};
