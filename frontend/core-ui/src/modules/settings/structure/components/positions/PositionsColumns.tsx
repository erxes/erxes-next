import { Cell, ColumnDef } from '@tanstack/table-core';
import { IPositionListItem } from '../../types/position';
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
import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { renderingPositionDetailAtom } from '../../states/renderingPositionDetail';
import { SelectPosition } from 'ui-modules/modules/structure/components/SelectPosition';

export const UnitEditColumnCell = ({
  cell,
}: {
  cell: Cell<IPositionListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('position_id');
  const setRenderingCustomerDetail = useSetAtom(renderingPositionDetailAtom);
  const { _id } = cell.row.original;
  return (
    <Button
      onClick={() => {
        setOpen(_id);
        setRenderingCustomerDetail(false);
      }}
      variant={'outline'}
    >
      <IconEdit size={12} />
    </Button>
  );
};

export const PositionsColumns: ColumnDef<IPositionListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IPositionListItem>,
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
  },
  {
    id: 'parentId',
    accessorKey: 'parentId',
    header: () => <RecordTable.InlineHead label="parent" />,
    cell: ({ cell }) => {
      const { parentId } = cell.row.original;
      return (
        <div>
          <SelectPosition
            className="shadow-none"
            value={parentId}
            onValueChange={() => {}}
          />
        </div>
      );
    },
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
            <RecordTableCellDisplay>{userCount}</RecordTableCellDisplay>
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
          <UnitEditColumnCell cell={cell} />
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
