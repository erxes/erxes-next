import { IconBooks } from '@tabler/icons-react';

export const CONFIG = {
  name: 'education',
  icon: IconBooks,
  path: '/educations',
  submenus: [
    {
      name: 'courses',
      path: 'education/courses',
    },
    {
      name: 'categories',
      path: 'education/categories',
    },
    {
      name: 'settings',
      path: 'education/settings',
    },
  ],
};
