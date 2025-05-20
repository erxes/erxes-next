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
            {cell.getValue() as string}
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
        <RecordTableCellDisplay>
          <SelectPosition
            className="shadow-none bg-transparent"
            value={cell.getValue() as string}
            onValueChange={() => {}}
          />
        </RecordTableCellDisplay>
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
          <RecordTableCellTrigger className="justify-center">
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
        <RecordTableCellDisplay className="justify-center gap-1 [&>button]:px-2">
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
        </RecordTableCellDisplay>
      );
    },
  },
];
