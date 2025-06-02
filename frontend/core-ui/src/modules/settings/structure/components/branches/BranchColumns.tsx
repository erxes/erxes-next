import { type Cell, type ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RecordTableTree,
  Textarea,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingBranchDetailAtom } from '../../states/renderingBranchDetail';
import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { IBranchListItem } from '../../types/branch';
import { SelectBranch } from 'ui-modules';
import {
  useBranchInlineEdit,
  useRemoveBranch,
} from '../../hooks/useBranchActions';
import { ChangeEvent, useState } from 'react';

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
export const BranchWorkingHoursColumnCell = ({
  cell,
}: {
  cell: Cell<IBranchListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('workingHoursId');
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
      <IconClock size={12} />
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
    id: 'title',
    accessorKey: 'title',
    header: () => <RecordTable.InlineHead label="title" />,
    cell: ({ cell }) => {
      const { title, _id } = cell.row.original;
      const [_title, setTitle] = useState<string>(title);
      const { branchesEdit, loading } = useBranchInlineEdit();
      const [open, setOpen] = useState<boolean>(false);

      const onSave = () => {
        if (_title !== title) {
          branchesEdit({ variables: { id: _id, title: _title } }, ['title']);
        }
      };

      const onChange = (el: ChangeEvent<HTMLInputElement>) => {
        const { value } = el.currentTarget;
        setTitle(value);
      };

      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            <RecordTableTree.Trigger
              order={cell.row.original.order}
              name={cell.getValue() as string}
              hasChildren={cell.row.original.hasChildren as boolean}
            >
              <TextOverflowTooltip value={cell.getValue() as string} />
            </RecordTableTree.Trigger>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={_title} onChange={onChange} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="code" />,
    cell: ({ cell }) => {
      const { code, _id } = cell.row.original;
      const [_code, setCode] = useState<string>(code);
      const { branchesEdit, loading } = useBranchInlineEdit();
      const [open, setOpen] = useState<boolean>(false);

      const onSave = () => {
        if (_code !== code) {
          branchesEdit({ variables: { id: _id, code: _code } }, ['code']);
        }
      };

      const onChange = (el: ChangeEvent<HTMLInputElement>) => {
        const { value } = el.currentTarget;
        setCode(value);
      };

      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            {cell.getValue() as string}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={_code} onChange={onChange} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
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
        <RecordTableCellDisplay className="text-center flex w-full justify-center">
          <Badge variant={'secondary'}>{cell.getValue() as number}</Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'action-group',
    header: () => <RecordTable.InlineHead label="Actions" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="flex justify-center gap-1 [&>button]:px-2">
          <BranchWorkingHoursColumnCell cell={cell} />
          <BranchEditColumnCell cell={cell} />
          <BranchRemoveCell cell={cell} />
        </RecordTableCellDisplay>
      );
    },
  },
];
