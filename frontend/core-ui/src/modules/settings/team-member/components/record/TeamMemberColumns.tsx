import {
  IconAlignLeft,
  IconCheckbox,
  IconChecks,
  IconMail,
  IconMailCheck,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import { Avatar, cn, Switch } from 'erxes-ui';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { IUser } from '../../types';
import { TextField } from './team-member-edit/TextField';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';

export const teamMemberColumns: ColumnDef<IUser>[] = [
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTableInlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => (
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback colorSeed={cell.row.original._id}>
              {cell.row.original.details.firstName?.charAt(0) ||
                cell.row.original.details.lastName?.charAt(0) ||
                cell.row.original.email?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        )}
      />
    ),
    size: 34,
  },
  {
    id: 'fullName',
    accessorKey: 'details',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="Full name" />
    ),
    cell: ({ cell }) => {
      const {
        details: { fullName },
        _id,
      } = cell.row.original;
      return (
        <TextField _id={_id} name={'fullName'} value={fullName as string} />
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTableInlineHead label="Invitation status	" icon={IconMailCheck} />
    ),
    cell: ({ cell }) => {
      const { status } = cell.row.original;
      return (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              status === 'Verified' ? 'text-green-400' : 'text-destructive',
              'uppercase font-semibold text-[10px]',
            )}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <RecordTableInlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => {
      const { email, _id } = cell.row.original;
      return <TextField _id={_id} name={'email'} value={email as string} />;
    },
  },
  ...['employeeId'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label={field} />,
    cell: ({ cell }: { cell: Cell<IUser, unknown> }) => (
      <TextField
        _id={cell.row.original._id}
        name={field}
        value={(cell.getValue() as string) || '-'}
      />
    ),
  })),
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: () => <RecordTableInlineHead icon={IconChecks} label="Status" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => <Switch checked={cell.row.original.isActive} />}
      />
    ),
  },
];
