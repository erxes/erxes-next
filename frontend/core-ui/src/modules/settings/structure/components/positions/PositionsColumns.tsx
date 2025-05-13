import { ColumnDef } from '@tanstack/table-core';
import { IPositionListItem } from '../../types/position';
import { Button, RecordTable } from 'erxes-ui';
import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';

export const PositionsColumns: ColumnDef<IPositionListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IPositionListItem>,
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="code" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original.code}</div>;
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <RecordTable.InlineHead label="title" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original.title}</div>;
    },
  },
  {
    id: 'parentId',
    accessorKey: 'parentId',
    header: () => <RecordTable.InlineHead label="parent" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original.parentId}</div>;
    },
  },
  {
    id: 'userCount',
    accessorKey: 'userCount',
    header: () => <RecordTable.InlineHead label="team member count" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original.userCount}</div>;
    },
  },
  {
    id: 'action-group',
    header: () => <RecordTable.InlineHead label="Actions" />,
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-1 [&>button]:px-2">
          <Button variant={'outline'}>
            <IconClock size={12} />
          </Button>
          <Button variant={'outline'}>
            <IconEdit size={12} />
          </Button>
          <Button
            variant={'outline'}
            className="text-destructive bg-destructive/10"
          >
            <IconTrash size={12} />
          </Button>
        </div>
      );
    },
  },
];
