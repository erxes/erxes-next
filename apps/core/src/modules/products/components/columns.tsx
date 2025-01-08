import {
  IconBuilding,
  IconChartBar,
  IconCircleCheck,
  IconHash,
  IconHistory,
  IconPlus,
  IconTags,
  IconCurrencyDollar,
  IconLabel,
} from '@tabler/icons-react';

export const columns = [
  {
    id: 'name',
    label: 'Name',
    icon: IconLabel,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'code',
    label: 'Code',
    icon: IconHash,
    type: 'text',
  },
  {
    id: 'unitPrice',
    label: 'Unit Price',
    icon: IconCurrencyDollar,
    type: 'currency',
  },
  {
    id: 'categoryId',
    label: 'Category',
    icon: IconChartBar,
    type: 'chip',
  },
  {
    id: 'status',
    label: 'Status',
    icon: IconCircleCheck,
    type: 'select',
  },
  {
    id: 'createdAt',
    label: 'Created At',
    icon: IconHistory,
    type: 'date',
    readOnly: true,
  },
  {
    id: 'tagIds',
    label: 'Tags',
    icon: IconTags,
    type: 'multiselect',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    icon: IconBuilding,
    type: 'handle',
  },
  {
    id: 'type',
    label: 'Type',
    icon: IconPlus,
    type: 'select',
  },
];
