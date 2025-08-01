import { Cell, ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Combobox,
  Command,
  Popover,
  RecordTable,
  RecordTableCellDisplay,
  TextOverflowTooltip,
  useConfirm,
  useQueryState,
} from 'erxes-ui';
import { IPermission } from 'ui-modules/modules/permissions/types/permission';
import { usePermissionsRemove } from 'ui-modules/modules/permissions/hooks/usePermissionsMutations';
import { IconTrash } from '@tabler/icons-react';

export const PermissionsColumnsMoreCell = ({
  cell,
}: {
  cell: Cell<IPermission, unknown>;
}) => {
  const confirmOptions = { confirmationValue: 'delete' };
  const { confirm } = useConfirm();
  const { permissionsRemove, loading } = usePermissionsRemove();
  const [, setOpen] = useQueryState('permission_id');

  const { _id } = cell.row.original;

  const onRemove = () => {
    confirm({
      message: 'Are you sure you want to remove the selected?',
      options: confirmOptions,
    }).then(async () => {
      try {
        permissionsRemove({
          variables: { ids: [_id] },
        });
      } catch (e) {
        console.error(e.message);
      }
    });
  };
  return (
    <Popover>
      <Popover.Trigger asChild>
        <RecordTable.MoreButton className="w-full h-full" />
      </Popover.Trigger>
      <Combobox.Content>
        <Command shouldFilter={false}>
          <Command.List>
            <Command.Item disabled={loading} value="remove" onSelect={onRemove}>
              <IconTrash /> Delete
            </Command.Item>
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};

export const permissionColumns: ColumnDef<IPermission>[] = [
  {
    id: 'more',
    cell: PermissionsColumnsMoreCell,
    size: 33,
  },
  RecordTable.checkboxColumn as ColumnDef<IPermission>,
  {
    id: 'module',
    accessorKey: 'module',
    header: () => <RecordTable.InlineHead label="Module" />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay className="capitalize">
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableCellDisplay>
    ),
    size: 250,
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: () => <RecordTable.InlineHead label="Action" />,
    cell: ({ cell }) => {
      const { action } = cell.row.original || {};
      if (!action) {
        return <RecordTableCellDisplay>N/A</RecordTableCellDisplay>;
      }
      if (action.endsWith('All')) {
        return (
          <RecordTableCellDisplay className="justify-center">
            <Badge>All</Badge>
          </RecordTableCellDisplay>
        );
      }
      return (
        <RecordTableCellDisplay className="justify-center">
          <Badge>{cell.getValue() as string}</Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'user',
    accessorKey: 'user',
    header: () => <RecordTable.InlineHead label="Email" />,
    cell: ({ cell }) => {
      const { user } = cell.row.original || {};
      return (
        <RecordTableCellDisplay>
          {user ? <Badge>{user.email}</Badge> : '-'}
        </RecordTableCellDisplay>
      );
    },
    size: 250,
  },
  {
    id: 'group',
    accessorKey: 'group',
    header: () => <RecordTable.InlineHead label="Group" />,
    cell: ({ cell }) => {
      const { group } = cell.row.original || {};
      return (
        <RecordTableCellDisplay>
          {group ? <Badge>{group.name}</Badge> : '-'}
        </RecordTableCellDisplay>
      );
    },
    size: 250,
  },
  {
    id: 'allowed',
    accessorKey: 'allowed',
    header: () => <RecordTable.InlineHead label="Allowed" />,
    cell: ({ cell }) => {
      const allowed = cell.getValue() as boolean;
      return (
        <RecordTableCellDisplay className="justify-center">
          <Badge variant={allowed ? 'success' : 'destructive'}>
            {allowed ? 'Allowed' : 'Denied'}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
  },
];
