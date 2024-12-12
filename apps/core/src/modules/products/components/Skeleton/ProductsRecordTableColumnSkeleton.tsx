import { ColumnDef } from '@tanstack/react-table';
import { ProductT } from '../../types/productTypes';
import {
  BoxIcon,
  Building2,
  ChartNoAxesGantt,
  CircleCheck,
  HashIcon,
  HistoryIcon,
  LetterText,
  PlusIcon,
  TagsIcon,
} from 'lucide-react';
import { Checkbox, Badge, Button, Avatar } from 'erxes-ui';
import { IconCurrencyTugrik } from '@tabler/icons-react';
import { Skeleton } from 'erxes-ui';

export const SkeletonColumns: ColumnDef<ProductT>[] = [
  {
    accessorKey: 'checkbox',
    id: 'checkbox',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          disabled
        />
      </div>
    ),
    size: 40,
    cell: ({ row }) =>
      (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          disabled
        />
        {/* <Skeleton className='h-4 w-4'></Skeleton> */}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    id: 'name',
    header: () => (
      <div className="flex items-center gap-1">
        <LetterText className="w-4 h-4" strokeWidth={2.5} />
        Name
      </div>
    ),
    cell: (info) => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: 'code',
    id: 'code',
    header: () => (
      <div className="flex items-center gap-1">
        <HashIcon className="w-4 h-4" strokeWidth={2.5} />
        Code
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 180,
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => (
      <div className="flex items-center gap-1">
        <IconCurrencyTugrik className="w-4 h-4" strokeWidth={2.5} />
        Price
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'categoryId',
    id: 'category',
    header: () => (
      <div className="flex items-center gap-1">
        <ChartNoAxesGantt className="w-4 h-4" strokeWidth={2.5} />
        Category
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: () => (
      <div className="flex items-center gap-1">
        <CircleCheck className="w-4 h-4" strokeWidth={2.5} />
        Status
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: (info) => (
      <div className="flex items-center gap-1">
        <HistoryIcon className="w-4 h-4" strokeWidth={2.5} />
        Created At
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'tagIds',
    id: 'tags',
    header: () => (
      <div className="flex items-center gap-1">
        <TagsIcon className="w-4 h-4" strokeWidth={2.5} />
        Tags
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: 'vendor',
    id: 'vendor',
    header: () => (
      <div className="flex items-center gap-1">
        <Building2 className="w-4 h-4" strokeWidth={2.5} />
        Vendor
      </div>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: 'Type',
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'add',
    id: 'add',
    size: 70,
    header: () => (
      <Button variant="ghost" className="h-full w-full">
        <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
      </Button>
    ),
    cell: () => (
      <div className="w-full h-full p-2">
        <Skeleton className="w-full h-full" />
      </div>
    ),
  },
];
