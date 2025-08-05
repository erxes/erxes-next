import {
  IconAffiliate,
  IconBookmarks,
  IconBuilding,
  IconCategory,
  IconChartPie,
  IconFile,
  IconMagnet,
  IconReport,
  IconShoppingCart,
  IconSpiral,
  IconUser,
} from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';

export const CORE_MODULES: IUIConfig['modules'] = [
  {
    name: 'contacts',
    icon: IconBookmarks,
    path: 'contacts',
    hasSettings: true,
    hasRelationWidget: true,
    submenus: [
      {
        name: 'customers',
        path: 'contacts/customers',
        icon: IconUser,
      },
      {
        name: 'leads',
        path: 'contacts/leads',
        icon: IconMagnet,
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
    icon: IconShoppingCart,
    path: 'products',
    hasSettings: true,
    hasRelationWidget: true,
    submenus: [
      {
        name: 'categories',
        path: 'products/categories',
        icon: IconCategory,
      },
    ],
  },
  {
    name: 'segments',
    icon: IconChartPie,
    path: 'segments',
    hasSettings: false,
    hasRelationWidget: true,
  },
  {
    name: 'automations',
    icon: IconAffiliate,
    path: 'automations',
    hasSettings: true,
    hasRelationWidget: true,
  },
  {
    name: 'logs',
    icon: IconReport,
    path: 'logs',
    hasSettings: false,
    hasRelationWidget: true,
  },
  {
    name: 'documents',
    icon: IconFile,
    path: 'documents',
    hasSettings: true,
    hasRelationWidget: false,
  },
];
