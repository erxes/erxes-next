import { Cell, ColumnDef } from '@tanstack/table-core';
import { IUnitListItem } from '../../types/unit';
import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import {
  Button,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingUnitDetailAtom } from '../../states/renderingUnitDetail';
import { AssignMember, SelectDepartment } from 'ui-modules';
import { useRemoveUnit } from '../../hooks/useUnitActions';

export const UnitEditColumnCell = ({
  cell,
}: {
  cell: Cell<IUnitListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('unit_id');
  const setRenderingCustomerDetail = useSetAtom(renderingUnitDetailAtom);
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

export const UnitRemoveCell = ({
  cell,
}: {
  cell: Cell<IUnitListItem, unknown>;
}) => {
  const { _id } = cell.row.original;
  const { handleRemove, loading } = useRemoveUnit();
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

export const UnitsColumns: ColumnDef<IUnitListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IUnitListItem>,
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="code" />,
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
    size: 300,
  },
  {
    id: 'supervisorId',
    accessorKey: 'supervisorId',
    header: () => <RecordTable.InlineHead label="supervisor" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <AssignMember
            className="shadow-none bg-transparent"
            value={cell.getValue() as string}
          />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'departmentId',
    accessorKey: 'departmentId',
    header: () => <RecordTable.InlineHead label="department" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <SelectDepartment
            value={cell.getValue() as string}
            onValueChange={() => {}}
            className="shadow-none bg-transparent"
          />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'userCount',
    accessorKey: 'userCount',
    header: () => <RecordTable.InlineHead label="team member count" />,
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay value={cell.getValue() as number} />
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
          <UnitRemoveCell cell={cell} />
        </RecordTableCellDisplay>
      );
    },
  },
];
