import { Cell, ColumnDef } from '@tanstack/table-core';
import { IPositionListItem } from '../../types/position';
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
  useQueryState,
} from 'erxes-ui';
import { IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { renderingPositionDetailAtom } from '../../states/renderingPositionDetail';
import { SelectPositions } from 'ui-modules';
import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { usePositionInlineEdit } from '../../hooks/usePositionActions';

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
            <RecordTableTree.Trigger
              order={cell.row.original.order}
              name={cell.getValue() as string}
              hasChildren={cell.row.original.hasChildren}
            >
              {cell.getValue() as string}
            </RecordTableTree.Trigger>
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
      const { _id } = cell.row.original || {};
      const { positionsEdit } = usePositionInlineEdit();
      return (
        <SelectPositions.InlineCell
          scope={
            SettingsHotKeyScope.PositionsPage +
            '.' +
            cell.row.original._id +
            '.parentId'
          }
          mode="single"
          value={cell.getValue() as string[]}
          onValueChange={(value) =>
            positionsEdit(
              {
                variables: {
                  _id,
                  parentId: value,
                },
              },
              ['parentId'],
            )
          }
        />
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
        <RecordTableCellDisplay className="justify-center">
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
        <RecordTableCellDisplay className="justify-center gap-1 [&>button]:px-2">
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
