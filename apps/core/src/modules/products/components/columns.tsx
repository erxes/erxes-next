import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../utils/makeData';
import { format } from 'date-fns';
import {
  BoxIcon,
  Building2,
  ChartNoAxesGantt,
  CircleCheck,
  DollarSign,
  HistoryIcon,
  LetterText,
  PlusIcon,
  TagsIcon,
} from 'lucide-react';
import { Checkbox, Badge, badgeColors, Button, Avatar } from 'erxes-ui';

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'title',
    id: 'title',
    header: () => (
      <div className="flex items-center gap-1">
        <LetterText className="w-4 h-4" strokeWidth={2.5} />
        Title
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
    accessorKey: 'price',
    id: 'price',
    header: () => (
      <div className="flex items-center gap-1">
        <DollarSign className="w-4 h-4" strokeWidth={2.5} />
        Price
      </div>
    ),
    cell: (info) => <div>${(info.getValue() as number).toLocaleString()}</div>,
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: () => (
      <div className="flex items-center gap-1">
        <ChartNoAxesGantt className="w-4 h-4" strokeWidth={2.5} />
        Category
      </div>
    ),
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
      return format(info.getValue() as string, 'MMM d, yyyy');
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
      return format(info.getValue() as string, 'MMM d, yyyy');
    },
    size: 180,
  },
  {
    accessorKey: 'tags',
    id: 'tags',
    header: () => (
      <div className="flex items-center gap-1">
        <TagsIcon className="w-4 h-4" strokeWidth={2.5} />
        Tags
      </div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-1">
        {(info.getValue() as Product['tags']).map((tag) => {
          const color =
            badgeColors[Math.floor(Math.random() * badgeColors.length)];
          return (
            <Badge key={tag} color={color}>
              {color}
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
            {(info.getValue() as string).charAt(0)}
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
    accessorKey: 'code',
    id: 'code',
    header: 'Code',
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
