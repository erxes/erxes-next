import {
  IconShoppingCartFilled,
  IconBookmarksFilled,
} from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CORE_MODULES: IUIConfig['modules'] = [
  {
    name: 'contacts',
    icon: IconBookmarksFilled,
    path: 'contacts',
    hasSettings: true,
    haveWidgets: true,
    submenus: [
      {
        name: 'customers',
        path: 'contacts/customers',
      },
      {
        name: 'leads',
        path: 'contacts/leads',
      },
      {
        name: 'companies',
        path: 'contacts/companies',
      },
      {
        name: 'vendors',
        path: 'contacts/vendors',
      },
      {
        name: 'clients',
        path: 'contacts/clients',
      },
    ],
  },
  {
    name: 'products',
    icon: IconShoppingCartFilled,
    path: 'products',
    hasSettings: true,
    haveWidgets: true,
    submenus: [
      {
        name: 'categories',
        path: 'products/categories',
      },
    ],
  },
];
