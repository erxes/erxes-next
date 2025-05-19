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
          <UserMoreColumnCell cell={cell} />
          <DepartmentRemoveCell cell={cell} />
        </div>
      );
    },
  },
];
