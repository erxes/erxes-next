import { IconClock, IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/table-core';
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
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import { IDepartmentListItem } from '../../types/department';
import { useSetAtom } from 'jotai';
import { renderingDepartmentDetailAtom } from '../../states/renderingDepartmentDetail';
import { AssignMember, AssignMemberTrigger } from 'ui-modules';
import { useRemoveDepartment } from '../../hooks/useDepartmentActions';

export const DepartmentWorkingHoursColumnCell = ({
  cell,
}: {
  cell: Cell<IDepartmentListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('workingHoursId');
  const setRenderingDepartmentDetail = useSetAtom(
    renderingDepartmentDetailAtom,
  );
  const { _id } = cell.row.original;
  return (
    <Button
      onClick={() => {
        setOpen(_id);
        setRenderingDepartmentDetail(false);
      }}
      variant={'outline'}
    >
      <IconClock size={12} />
    </Button>
  );
};

export const DepartmentMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IDepartmentListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('department_id');
  const setRenderingDepartmentDetail = useSetAtom(
    renderingDepartmentDetailAtom,
  );
  const { _id } = cell.row.original;
  return (
    <Button
      onClick={() => {
        setOpen(_id);
        setRenderingDepartmentDetail(false);
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
            <RecordTableTree.Trigger
              order={(cell.row.original?.order as string) || ''}
              name={cell.getValue() as string}
              hasChildren={cell.row.original?.hasChildren as boolean}
            >
              <TextOverflowTooltip value={cell.getValue() as string} />
            </RecordTableTree.Trigger>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 350,
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
        <RecordTableCellDisplay className="gap-1 [&>button]:px-2 justify-center">
          <DepartmentWorkingHoursColumnCell cell={cell} />
          <DepartmentMoreColumnCell cell={cell} />
          <DepartmentRemoveCell cell={cell} />
        </RecordTableCellDisplay>
      );
    },
  },
];
