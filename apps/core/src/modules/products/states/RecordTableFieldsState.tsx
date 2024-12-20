import { atom } from "recoil";
import {
    IconBuilding,
    IconChartBar,
    IconCircleCheck,
    IconHash,
    IconHistory,
    IconAlignLeft,
    IconTags,
    IconCurrencyTugrik,
  } from '@tabler/icons-react';
type Field = {
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
    isHidden: boolean;
  };
  
export const fieldsState = atom<Field[]>({
    key: "fieldsState",
    default: [
        {
          id: 'name',
          name: 'Name',
          icon: IconAlignLeft,
          isHidden: false,
        },
        {
          id: 'code',
          name: 'Code',
          icon: IconHash,
          isHidden: false,
        },
        {
          id: 'unitPrice',
          name: 'Price',
          icon: IconCurrencyTugrik,
          isHidden: false,
        },
        {
          id: 'categoryId',
          name: 'Category',
          icon: IconChartBar,
          isHidden: true,
        },
        {
          id: 'status',
          name: 'Status',
          icon: IconCircleCheck,
          isHidden: true,
        },
        {
          id: 'createdAt',
          name: 'Created At',
          icon: IconHistory,
          isHidden: false,
        },
        {
          id: 'tagIds',
          name: 'Tags',
          icon: IconTags,
          isHidden: false,
        },
        {
          id: 'vendor',
          name: 'Vendor',
          icon: IconBuilding,
          isHidden: true,
        },
      ]
})