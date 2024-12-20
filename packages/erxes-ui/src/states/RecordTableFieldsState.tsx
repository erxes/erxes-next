import { atom, selector } from 'recoil';
import type { Icon } from '@tabler/icons-react';
import {
  IconBuilding,
  IconChartBar,
  IconCircleCheck,
  IconHash,
  IconHistory,
  IconAlignLeft,
  IconTags,
  IconCurrencyTugrik,
  IconLayoutGrid,
} from '@tabler/icons-react';

type Field = {
  id: string;
  name: string;
  icon: Icon;
  isVisible: boolean;
};

export const fieldsState = atom<Field[]>({
  key: 'fieldsState',
  default: [
    {
      id: 'name',
      name: 'Name',
      icon: IconAlignLeft,
      isVisible: true,
    },
    {
      id: 'code',
      name: 'Code',
      icon: IconHash,
      isVisible: false,
    },
    {
      id: 'unitPrice',
      name: 'Price',
      icon: IconCurrencyTugrik,
      isVisible: true,
    },
    {
      id: 'category',
      name: 'Category',
      icon: IconChartBar,
      isVisible: true,
    },
    {
      id: 'status',
      name: 'Status',
      icon: IconCircleCheck,
      isVisible: false,
    },
    {
      id: 'createdAt',
      name: 'Created At',
      icon: IconHistory,
      isVisible: false,
    },
    {
      id: 'tags',
      name: 'Tags',
      icon: IconTags,
      isVisible: false,
    },
    {
      id: 'vendor',
      name: 'Vendor',
      icon: IconBuilding,
      isVisible: false,
    },
    {
      id: 'type',
      name: 'Type',
      icon: IconLayoutGrid,
      isVisible: true,
    },
  ],
});

export const columnVisibilityState = selector({
  key: 'columnVisibilityState',
  get: ({ get }) => {
    const fields = get(fieldsState);
    return fields.reduce((acc, field) => {
      acc[field.id] = field.isVisible;
      return acc;
    }, {} as Record<string, boolean>);
  },
  set: ({ set, get }, newVisibility) => {
    const currentFields = get(fieldsState);
    const updatedFields = currentFields.map((field) => ({
      ...field,
      isVisible: newVisibility[field.id] ?? field.isVisible,
    }));
    set(fieldsState, updatedFields);
  },
});


export const columnOrderState = selector({
  key: 'columnOrderState',
  get: ({ get }) => {
    const fields = get(fieldsState);
    return fields.map((field) => field.id);
  },
  set: ({ set, get }, newColumnOrder) => {
    if (!Array.isArray(newColumnOrder)) return;

    const currentFields = get(fieldsState);

    const newOrderMap = new Map(
      (newColumnOrder as string[]).map((id, index) => [id, index])
    );

    const newFields = currentFields.map((field) => ({
      ...field,
    }));

    newFields.sort((a, b) => {
      const aIndex = newOrderMap.get(a.id) ?? Number.MAX_VALUE;
      const bIndex = newOrderMap.get(b.id) ?? Number.MAX_VALUE;
      return aIndex - bIndex;
    });

    set(fieldsState, newFields);
  },
});
