import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/table-core';
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
import { IDepartmentListItem } from '../../types/department';
import { useSetAtom } from 'jotai';
import { renderingDepartmentDetailAtom } from '../../states/renderingDepartmentDetail';
import { AssignMember, AssignMemberTrigger } from 'ui-modules';
import { useRemoveDepartment } from '../../hooks/useDepartmentActions';

export const UserMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IDepartmentListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('department_id');
  const setRenderingCustomerDetail = useSetAtom(renderingDepartmentDetailAtom);
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

export const DepartmentRemoveCell = ({
  cell,
}: {
  cell: Cell<IDepartmentListItem, unknown>;
}) => {
  const { _id } = cell.row.original;
  const { handleRemove, loading } = useRemoveDepartment();
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

export const DepartmentColumns: ColumnDef<IDepartmentListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IDepartmentListItem>,
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
        <RecordTableCellDisplay className="gap-1 [&>button]:px-2 justify-center">
          <Button variant={'outline'}>
            <IconClock size={12} />
          </Button>
          <UserMoreColumnCell cell={cell} />
          <DepartmentRemoveCell cell={cell} />
        </RecordTableCellDisplay>
      );
    },
  },
];
