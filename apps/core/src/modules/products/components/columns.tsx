import { ColumnDef } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import {
  Building2,
  ChartNoAxesGantt,
  CircleCheck,
  HashIcon,
  HistoryIcon,
  LetterText,
  PlusIcon,
  TagsIcon,
} from 'lucide-react';
import { Checkbox, Button } from 'erxes-ui';
import { RelativeDateDisplay } from 'erxes-ui/display';
import { PriceCell } from '@/products/components/PriceCell';
import { IconCurrencyTugrik, IconLayoutGrid } from '@tabler/icons-react';
import {
  CategoryCell,
  CategoryCellWrapper,
} from '@/products/components/CategoryCell';
import { TagsCell } from '@/products/components/TagsCell';
import StatusCell from '@/products/components/Status';
import { VendorCell } from '@/products/components/VendorCell';
import { ProductNameCell } from '@/products/components/ProductNameCell';
import { ProductTypeIcon } from './ProductTypeIcon';

export const columns: ColumnDef<ProductT>[] = [
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
        />
      </div>
    ),
    size: 40,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
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
    cell: ProductNameCell,
    footer: (props) => props.column.id,
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
    cell: (info) => (
      <div className="flex items-center gap-1 px-2">
        {info.getValue() as string}
      </div>
    ),
    footer: (props) => props.column.id,
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
    cell: (info) => <PriceCell {...info} />,
    footer: (props) => props.column.id,
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
    cell: CategoryCell,
    footer: (props) => props.column.id,
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
    cell: StatusCell,
    footer: (props) => props.column.id,
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
    footer: (props) => props.column.id,
    cell: (info) => {
      return (
        <CategoryCellWrapper>
          <RelativeDateDisplay date={info.getValue() as string} />
        </CategoryCellWrapper>
      );
    },
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
    cell: TagsCell,
    footer: (props) => props.column.id,
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
    cell: VendorCell,
    footer: (props) => props.column.id,
    size: 280,
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: () => (
      <div className="flex items-center gap-1">
        <IconLayoutGrid className="w-4 h-4" strokeWidth={2.5} />
        Type
      </div>
    ),
    cell: (info) => {
      return (
        <CategoryCellWrapper>
          <ProductTypeIcon {...info} />
          {info.getValue() as string}
        </CategoryCellWrapper>
      );
    },
    footer: (props) => props.column.id,
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
  },
];
