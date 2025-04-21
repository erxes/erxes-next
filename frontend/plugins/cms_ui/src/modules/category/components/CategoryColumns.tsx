import { IconLabel, IconCalendarPlus } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';

export const CategoryColumns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'Name',
    header: () => (
      <RecordTableInlineHead icon={IconLabel} label="CATEGORY NAME" />
    ),
    cell: ({ cell }) => {
      const { name } = cell.row.original;

      return (
        <div className="p-2">
          {name} <br />
        </div>
      );
    },
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: () => (
      <RecordTableInlineHead icon={IconLabel} label="CATEGORY SLUG" />
    ),
    cell: ({ cell }) => {
      const { slug } = cell.row.original;

      return (
        <div className="p-2">
          {slug} <br />
        </div>
      );
    },
  },
  {
    id: 'Description',
    accessorKey: 'Description',
    header: () => (
      <RecordTableInlineHead icon={IconLabel} label="CATEGORY DESCRIPTION" />
    ),
    cell: ({ cell }) => {
      const { desc } = cell.row.original;

      return (
        <div className="p-2">
          {desc} <br />
        </div>
      );
    },
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: () => (
      <RecordTableInlineHead icon={IconCalendarPlus} label="UPDATED DATE" />
    ),
    cell: ({ cell }) => {
      const { updatedAt } = cell.row.original;

      return (
        <div className="p-2">
          {updatedAt} <br />
        </div>
      );
    },
  },
];
