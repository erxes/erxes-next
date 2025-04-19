import {
  IconAlignLeft,
  IconChecks,
  IconMail,
  IconMailCheck,
  IconUser,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import { Avatar, cn, Switch } from 'erxes-ui';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { IUser } from '@/settings/team-member/types';
import { TextFieldUser } from '@/settings/team-member/components/record/team-member-edit/TextField';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import dayjs from 'dayjs';
import { TextFieldUserDetails } from '@/settings/team-member/components/record/team-member-edit/TextFieldDetails';
import { FirstNameField } from '@/settings/team-member/components/record/team-member-edit/FirstNameField';

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
    id: 'firstName',
    accessorKey: 'firstName',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="First name" />
    ),
    cell: ({ cell }) => {
      const {
        details: { firstName },
        _id,
      } = cell.row.original;
      return (
        <FirstNameField
          field="firstName"
          _id={_id}
          value={firstName as string}
        />
      );
    },
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="Last name" />
    ),
    cell: ({ cell }) => {
      const {
        details: { lastName },
        _id,
      } = cell.row.original;
      return (
        <TextFieldUserDetails
          field="lastName"
          _id={_id}
          value={lastName as string}
        />
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
      return <TextFieldUser field="email" _id={_id} value={email as string} />;
    },
  },
  ...['employeeId'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label={field} />,
    cell: ({ cell }: { cell: Cell<IUser, unknown> }) => (
      <TextFieldUser
        field="employeeId"
        _id={cell.row.original._id}
        className="text-center"
        value={(cell.getValue() as string) || '-'}
      />
    ),
  })),
  {
    id: 'position',
    accessorKey: 'position',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="Position" />
    ),
    cell: ({ cell }) => {
      const {
        details: { position },
        _id,
      } = cell.row.original;
      return (
        <TextFieldUserDetails
          field={'position'}
          _id={_id}
          value={cell.getValue() as string}
        />
      );
    },
  },
  {
    id: 'workStartedDate',
    accessorKey: 'workStartedDate',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="workStartedDate" />
    ),
    cell: ({ cell }) => {
      const {
        details: { workStartedDate },
        _id,
      } = cell.row.original;
      return (
        <TextFieldUserDetails
          field="workStartedDate"
          _id={_id}
          value={
            (workStartedDate &&
              (dayjs(workStartedDate).format('YYYY/MM/DD') as string)) ||
            '-'
          }
        />
      );
    },
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: () => <RecordTableInlineHead icon={IconChecks} label="Status" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => (
          <Switch className="mx-auto" checked={cell.row.original.isActive} />
        )}
      />
    ),
  },
];
