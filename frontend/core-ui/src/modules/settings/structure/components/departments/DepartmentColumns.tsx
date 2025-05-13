import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { Button, RecordTable } from 'erxes-ui';
import { IDepartmentListItem } from '../../types/department';

export const DepartmentColumns: ColumnDef<IDepartmentListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IDepartmentListItem>,
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
    id: 'supervisorId',
    accessorKey: 'supervisorId',
    header: () => <RecordTable.InlineHead label="supervisor" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original.supervisorId}</div>;
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
