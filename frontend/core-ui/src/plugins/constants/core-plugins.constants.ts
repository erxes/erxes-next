import {
  IconShoppingCartFilled,
  IconBookmarksFilled,
  IconLogs,
  IconChartPie,
  IconMagnetFilled,
  IconUserFilled,
  IconBuilding,
  IconSpiral,
  IconCategoryFilled,
} from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CORE_MODULES: IUIConfig['modules'] = [
  {
    name: 'contacts',
    icon: IconBookmarksFilled,
    path: 'contacts',
    hasSettings: true,
    hasWidgets: true,
    submenus: [
      {
        name: 'customers',
        path: 'contacts/customers',
        icon: IconUserFilled,
      },
      {
        name: 'leads',
        path: 'contacts/leads',
        icon: IconMagnetFilled,
      },
      {
        name: 'companies',
        path: 'contacts/companies',
        icon: IconBuilding,
      },
      {
        name: 'vendors',
        path: 'contacts/vendors',
        icon: IconSpiral,
      },
      {
        name: 'clients',
        path: 'contacts/clients',
        icon: IconSpiral,
      },
    ],
  },
  {
    name: 'products',
    icon: IconShoppingCartFilled,
    path: 'products',
    hasSettings: true,
    hasWidgets: true,
    submenus: [
      {
        name: 'categories',
        path: 'products/categories',
        icon: IconCategoryFilled,
      },
    ],
  },
  {
    name: 'segments',
    icon: IconChartPie,
    path: 'segments',
    hasSettings: true,
    hasWidgets: true,
  },
];
