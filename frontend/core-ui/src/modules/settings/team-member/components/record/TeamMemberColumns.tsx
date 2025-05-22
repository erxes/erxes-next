import {
  IconAlignLeft,
  IconChecks,
  IconMail,
  IconMailCheck,
  IconUser,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import {
  Avatar,
  Badge,
  InlineCell,
  Switch,
  useQueryState,
  RecordTable,
  RecordTablePopover,
  RecordTableCellTrigger,
  Input,
  RecordTableCellContent,
  TextOverflowTooltip,
} from 'erxes-ui';
import { IUser } from '@/settings/team-member/types';
import { TextFieldUser } from '@/settings/team-member/components/record/team-member-edit/TextField';
import dayjs from 'dayjs';
import { TextFieldUserDetails } from '@/settings/team-member/components/record/team-member-edit/TextFieldDetails';
import { FirstNameField } from '@/settings/team-member/components/record/team-member-edit/FirstNameField';
import { useSetAtom } from 'jotai';
import { renderingTeamMemberDetailAtom } from '../../states/renderingTeamMemberDetail';
import { SelectPosition } from 'ui-modules/modules/structure/components/SelectPosition';

export const UserMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IUser, unknown>;
}) => {
  const [, setOpen] = useQueryState('user_id');
  const setRenderingTeamMemberDetail = useSetAtom(
    renderingTeamMemberDetailAtom,
  );
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingTeamMemberDetail(false);
      }}
    />
  );
};

export const teamMemberColumns: ColumnDef<IUser>[] = [
  {
    id: 'more',
    cell: UserMoreColumnCell,
    size: 33,
  },
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => (
      <InlineCell
        name="avatar"
        className="flex items-center justify-center"
        recordId={cell.row.original._id}
        display={() => (
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback>
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
      <RecordTable.InlineHead icon={IconAlignLeft} label="First name" />
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
      <RecordTable.InlineHead icon={IconAlignLeft} label="Last name" />
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
      <RecordTable.InlineHead label="Invitation status	" icon={IconMailCheck} />
    ),
    cell: ({ cell }) => {
      const { status } = cell.row.original;
      return (
        <InlineCell
          name="status"
          className="flex items-center justify-center"
          recordId={cell.row.original._id}
          display={() => {
            if (status === 'Verified') {
              return <Badge variant={'success'}>{status}</Badge>;
            } else {
              return <Badge variant={'destructive'}>Unverified</Badge>;
            }
          }}
        />
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <RecordTable.InlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => {
      const { email, _id } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger asChild>{email}</RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input key={_id} value={email} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  ...['employeeId'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTable.InlineHead icon={IconAlignLeft} label={field} />,
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
      <RecordTable.InlineHead icon={IconAlignLeft} label="Position" />
    ),
    cell: ({ cell }) => {
      const {
        details: { position },
        _id,
      } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={position} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <SelectPosition value={position} onValueChange={() => {}} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'workStartedDate',
    accessorKey: 'workStartedDate',
    header: () => (
      <RecordTable.InlineHead icon={IconAlignLeft} label="workStartedDate" />
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
    header: () => <RecordTable.InlineHead icon={IconChecks} label="Status" />,
    cell: ({ cell }) => (
      <InlineCell
        name="isActive"
        className="flex items-center justify-center"
        recordId={cell.row.original._id}
        display={() => (
          <Switch className="mx-auto" checked={cell.row.original.isActive} />
        )}
      />
    ),
  },
];
