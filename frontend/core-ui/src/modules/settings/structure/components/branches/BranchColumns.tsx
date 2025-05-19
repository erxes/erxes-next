import { type Cell, type ColumnDef } from '@tanstack/table-core';
import {
  Button,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingBranchDetailAtom } from '../../states/renderingBranchDetail';
import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { IBranchListItem } from '../../types/branch';
import { SelectBranch } from 'ui-modules';
import { useRemoveBranch } from '../../hooks/useBranchActions';

export const BranchEditColumnCell = ({
  cell,
}: {
  cell: Cell<IBranchListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('branch_id');
  const setRenderingBranchDetail = useSetAtom(renderingBranchDetailAtom);
  const { _id } = cell.row.original;
  return (
    <Button
      onClick={() => {
        setOpen(_id);
        setRenderingBranchDetail(false);
      }}
      variant={'outline'}
    >
      <IconEdit size={12} />
    </Button>
  );
};

export const BranchRemoveCell = ({
  cell,
}: {
  cell: Cell<IBranchListItem, unknown>;
}) => {
  const { _id } = cell.row.original;
  const { handleRemove, loading } = useRemoveBranch();
  const onRemove = () => {
    handleRemove({
      variables: {
        ids: [_id],
      },
    });
  };
  return (
    <Button
      variant={'outline'}
      disabled={loading}
      onClick={onRemove}
      className="text-destructive bg-destructive/10"
    >
      <IconTrash size={12} />
    </Button>
  );
};

export const BranchColumns: ColumnDef<IBranchListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IBranchListItem>,
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="code" />,
    cell: ({ cell }) => {
      const { code } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay>{code}</RecordTableCellDisplay>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={code} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <RecordTable.InlineHead label="title" />,
    cell: ({ cell }) => {
      const { title } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay>{title}</RecordTableCellDisplay>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={title} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'parentId',
    accessorKey: 'parentId',
    header: () => <RecordTable.InlineHead label="parent" />,
    cell: ({ cell }) => {
      const { parentId } = cell.row.original;
      return (
        <div>
          <SelectBranch
            className="shadow-none bg-transparent"
            value={parentId}
            onValueChange={() => {}}
          />
        </div>
      );
    },
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: () => <RecordTable.InlineHead label="address" />,
    cell: ({ cell }) => {
      const { address } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay>{address}</RecordTableCellDisplay>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={address} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'userCount',
    accessorKey: 'userCount',
    header: () => <RecordTable.InlineHead label="team member count" />,
    cell: ({ cell }) => {
      const { userCount } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay className="text-center flex w-full">
              {userCount}
            </RecordTableCellDisplay>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={userCount} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'action-group',
    header: () => <RecordTable.InlineHead label="Actions" />,
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1 [&>button]:px-2">
          <Button variant={'outline'}>
            <IconClock size={12} />
          </Button>
          <BranchEditColumnCell cell={cell} />
          <BranchRemoveCell cell={cell} />
        </div>
      );
    },
  },
];
