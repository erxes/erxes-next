import { type Cell, type ColumnDef } from '@tanstack/table-core';
import {
  Button,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  Textarea,
  TextOverflowTooltip,
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
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            {cell.getValue() as string}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
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
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={cell.getValue() as string} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
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
      return (
        <div>
          <SelectBranch
            className="shadow-none bg-transparent"
            value={cell.getValue() as string}
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
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={cell.getValue() as string} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Textarea value={cell.getValue() as string} />
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
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger className="text-center flex w-full justify-center">
            {cell.getValue() as number}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as number} />
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
        <RecordTableCellDisplay className="flex justify-center gap-1 [&>button]:px-2">
          <Button variant={'outline'}>
            <IconClock size={12} />
          </Button>
          <BranchEditColumnCell cell={cell} />
          <BranchRemoveCell cell={cell} />
        </RecordTableCellDisplay>
      );
    },
  },
];
