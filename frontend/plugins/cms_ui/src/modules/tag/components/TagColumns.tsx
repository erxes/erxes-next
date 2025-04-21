import {
  IconLabel,
  IconCategoryFilled,
  IconLabelFilled,
  IconCalendarPlus,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';

export const tagColumns: ColumnDef<any>[] = [
  {
    id: 'Tag name',
    accessorKey: 'tagName',
    header: () => <RecordTableInlineHead icon={IconLabel} label="TAG NAME" />,
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
    id: 'Tag slug',
    accessorKey: 'tagSlug',
    header: () => <RecordTableInlineHead icon={IconLabel} label="SLUG" />,
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
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTableInlineHead icon={IconCalendarPlus} label="CREATED DATE" />
    ),
    cell: ({ cell }) => {
      const { createdAt } = cell.row.original;

      return (
        <div className="p-2">
          {createdAt} <br />
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
