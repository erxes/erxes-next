import {
  IconAlignLeft,
  IconCheckbox,
  IconMail,
  IconUserFilledGroup,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import { cn } from 'erxes-ui';
import { RecordTable } from 'erxes-ui';
import { TextField } from '@/settings/permission/components/permission-edit/TextField';
import { IPermission } from '@/settings/permission/types';

export const permissionColumns: ColumnDef<IPermission>[] = [
  ...['module', 'action'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTable.InlineHead icon={IconAlignLeft} label={field} />,
    cell: ({ cell }: { cell: Cell<IPermission, unknown> }) => (
      <TextField
        _id={cell.row.original._id}
        name={field}
        value={cell.getValue() as string}
      />
    ),
  })),
  {
    id: 'email',
    accessorKey: 'user',
    header: () => <RecordTable.InlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => {
      const { user, _id } = cell.row.original;
      return (
        <TextField _id={_id} name={'email'} value={user?.email as string} />
      );
    },
  },
  {
    id: 'group',
    accessorKey: 'group',
    header: () => (
      <RecordTable.InlineHead icon={IconUserFilledGroup} label="Group" />
    ),
    cell: ({ cell }) => {
      const { group, _id } = cell.row.original;
      return (
        <TextField _id={_id} name={'group'} value={group?.name as string} />
      );
    },
  },
  {
    id: 'allowed',
    accessorKey: 'allowed',
    header: () => <RecordTable.InlineHead label="Allow" icon={IconCheckbox} />,
    cell: ({ cell }) => {
      const { allowed } = cell.row.original;
      return (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              allowed ? 'text-green-400' : 'text-destructive',
              'uppercase font-semibold text-[10px]',
            )}
          >
            {allowed ? 'allowed' : 'not allowed'}
          </span>
        </div>
      );
    },
  },
];
