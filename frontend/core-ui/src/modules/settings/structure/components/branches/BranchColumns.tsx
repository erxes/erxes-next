import { type Cell, type ColumnDef } from '@tanstack/table-core';
import { Button, RecordTable, useQueryState } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingBranchDetailAtom } from '../../states/renderingBranchDetail';
import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { IBranchListItem } from '../../types/branch';

export const UserMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IBranchListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('branch_id');
  const setRenderingCustomerDetail = useSetAtom(renderingBranchDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingCustomerDetail(false);
      }}
    />
  );
};

export const BranchColumns: ColumnDef<IBranchListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IBranchListItem>,
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="code" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original?.code}</div>;
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <RecordTable.InlineHead label="title" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original?.title}</div>;
    },
  },
  {
    id: 'parentId',
    accessorKey: 'parentId',
    header: () => <RecordTable.InlineHead label="parent" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original?.parentId}</div>;
    },
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: () => <RecordTable.InlineHead label="address" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original?.address}</div>;
    },
  },
  {
    id: 'userCount',
    accessorKey: 'userCount',
    header: () => <RecordTable.InlineHead label="team member count" />,
    cell: ({ cell }) => {
      return <div>{cell.row.original?.userCount}</div>;
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
