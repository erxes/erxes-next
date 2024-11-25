import {
  Mail,
  PieChart,
  Wallet,
  SquareCheck,
  Users,
  Package,
} from 'lucide-react';

export const PLUGINS = {
  contacts: {
    title: 'contacts',
    icon: Users,
  },
  inbox: {
    title: 'teamInbox',
    icon: Mail,
  },
  insights: {
    title: 'insights',
    icon: PieChart,
  },
  products: {
    title: 'products',
    icon: Package,
  },
  sales: {
    title: 'sales',
    icon: Wallet,
  },
  tasks: {
    title: 'tasks',
    icon: SquareCheck,
  },
};
