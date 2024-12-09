import { ColumnDef } from '@tanstack/react-table';
import { ProductT } from '../types/productTypes';
import {
  BoxIcon,
  Building2,
  ChartNoAxesGantt,
  CircleCheck,
  HistoryIcon,
  LetterText,
  PlusIcon,
  TagsIcon,
} from 'lucide-react';
import { Checkbox, Badge, badgeColors, Button, Avatar } from 'erxes-ui';
import { RelativeDateDisplay } from 'erxes-ui/display';
import { PriceCell } from './PriceCell';
import { IconCurrencyTugrik } from '@tabler/icons-react';
import { CategoryCell } from './CategoryCell';

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
    cell: (info) => (
      <Button size="sm" variant="link">
        <BoxIcon className="w-4 h-4 text-primary" strokeWidth={1.5} />
        {info.getValue() as string}
      </Button>
    ),
    footer: (props) => props.column.id,
    size: 280,
  },
  {
    accessorKey: 'code',
    id: 'code',
    header: 'Code',
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
    cell: (info) => <CategoryCell {...info} />,
    footer: (props) => props.column.id,
    size: 180,
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
      return <RelativeDateDisplay date={info.getValue() as string} />;
    },
    size: 180,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: (info) => (
      <div className="flex items-center gap-1">
        <HistoryIcon className="w-4 h-4" strokeWidth={2.5} />
        Updated At
      </div>
    ),
    footer: (props) => props.column.id,
    cell: (info) => {
      return <RelativeDateDisplay date={info.getValue() as string} />;
    },
    size: 180,
  },
  {
    accessorKey: 'getTags',
    id: 'tags',
    header: () => (
      <div className="flex items-center gap-1">
        <TagsIcon className="w-4 h-4" strokeWidth={2.5} />
        Tags
      </div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-1">
        {((info.getValue() as ProductT['tagIds']) || []).map((tag) => {
          const color =
            badgeColors[Math.floor(Math.random() * badgeColors.length)];
          return (
            <Badge key={tag} color={color}>
              {tag}
            </Badge>
          );
        })}
      </div>
    ),
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
    cell: (info) => (
      <Button size="sm" variant="secondary">
        <Avatar.Root>
          <Avatar.Image />
          <Avatar.Fallback className="bg-blue-100 text-blue-800">
            {((info.getValue() || '') as string).charAt(0)}
          </Avatar.Fallback>
        </Avatar.Root>
        {info.getValue() as string}
      </Button>
    ),
    footer: (props) => props.column.id,
    size: 280,
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: 'Type',
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
