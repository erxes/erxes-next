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
  Table,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingUnitDetailAtom } from '../../states/renderingUnitDetail';
import {
  AssignMember,
  AssignMemberTrigger,
  SelectDepartment,
} from 'ui-modules';
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
    id: 'supervisorId',
    accessorKey: 'supervisorId',
    header: () => <RecordTable.InlineHead label="supervisor" />,
    cell: ({ cell }) => {
      const { supervisorId } = cell.row.original;
      return (
        <div>
          <AssignMember className="shadow-none" value={supervisorId} />
        </div>
      );
    },
  },
  {
    id: 'departmentId',
    accessorKey: 'departmentId',
    header: () => <RecordTable.InlineHead label="department" />,
    cell: ({ cell }) => {
      const { departmentId } = cell.row.original;
      return (
        <div>
          <SelectDepartment
            value={departmentId}
            onValueChange={() => {}}
            className="shadow-none"
          />
        </div>
      );
    },
    size: 200,
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
          <UnitRemoveCell cell={cell} />
        </div>
      );
    },
  },
];
