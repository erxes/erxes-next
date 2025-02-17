import {
  IconShoppingCartFilled,
  IconBookmarksFilled,
} from '@tabler/icons-react';

export const CORE_PLUGINS = [
  {
    name: 'contacts',
    icon: IconBookmarksFilled,
    path: '/contacts',
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
  { name: 'products', icon: IconShoppingCartFilled, path: '/products' },
];
