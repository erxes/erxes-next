import {
  IconAlignLeft,
  IconChecks,
  IconLabelFilled,
  IconMail,
  IconMailCheck,
  IconUser,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import {
  Avatar,
  Badge,
  Switch,
  useQueryState,
  RecordTable,
  RecordTablePopover,
  RecordTableCellTrigger,
  Input,
  RecordTableCellContent,
  FullNameField,
  DatePicker,
  readFile,
  RecordTableCellDisplay,
} from 'erxes-ui';
import { IUser } from '@/settings/team-member/types';
import { useSetAtom } from 'jotai';
import { renderingTeamMemberDetailAtom } from '../../states/renderingTeamMemberDetail';
import { SelectPositions } from 'ui-modules';
import { useUserEdit, useUsersStatusEdit } from '../../hooks/useUserEdit';
import { ChangeEvent, useState } from 'react';
import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { format } from 'date-fns';
import { TeamMemberEmailField } from './team-member-edit/TeammemberEmailField';
import { ApolloError } from '@apollo/client';

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
    cell: ({ cell }) => {
      const { firstName, lastName } = cell.row.original.details;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar size="lg">
            <Avatar.Image src={readFile(cell.getValue() as string)} />
            <Avatar.Fallback>
              {firstName?.charAt(0) || lastName?.charAt(0) || '-'}
            </Avatar.Fallback>
          </Avatar>
        </div>
      );
    },
    size: 34,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      const [, setDetailOpen] = useQueryState('user_id');
      const setRenderingTeamMemberDetail = useSetAtom(
        renderingTeamMemberDetailAtom,
      );
      const { details, _id } = cell.row.original;
      const { firstName, lastName } = details || {};

      const { usersEdit } = useUserEdit();

      const onSave = (first: string, last: string) => {
        if (first !== firstName || last !== lastName) {
          usersEdit(
            {
              variables: {
                _id,
                details: {
                  firstName: first,
                  lastName: last,
                },
              },
              onError: (error: ApolloError) =>
                console.error('Failed to update user details:', error),
            },
            ['details'],
          );
        }
      };

      return (
        <FullNameField
          scope={SettingsHotKeyScope.UsersPage + '.' + _id + '.Name'}
          firstName={firstName}
          lastName={lastName}
          onClose={onSave}
          closeOnEnter
          onClick={(e) => {
            e.stopPropagation();
            setDetailOpen(_id);
            setRenderingTeamMemberDetail(false);
          }}
        />
      );
    },
    size: 240,
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
        <RecordTableCellDisplay>
          <Badge
            variant={
              !status || status === 'Not verified' ? 'destructive' : 'success'
            }
          >
            {status || 'Not verified'}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <RecordTable.InlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => <TeamMemberEmailField cell={cell} />,
    size: 250,
  },
  ...['employeeId'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTable.InlineHead icon={IconAlignLeft} label={field} />,
    cell: ({ cell }: { cell: Cell<IUser, unknown> }) => {
      const { _id, employeeId } = cell.row.original || {};
      const { usersEdit } = useUserEdit();
      const [open, setOpen] = useState<boolean>(false);
      const [_employeeId, setEmployeeId] = useState<string>(employeeId);
      const onSave = () => {
        usersEdit(
          {
            variables: {
              _id,
              employeeId: _employeeId,
            },
          },
          ['employeeId'],
        );
      };

      const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget || {};
        if (value === employeeId) return;
        setEmployeeId(value);
      };
      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            {(employeeId && (
              <Badge variant={'secondary'}>{employeeId}</Badge>
            )) ||
              '-'}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={_employeeId} onChange={onChange} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  })),
  {
    id: 'positionIds',
    accessorKey: 'positionIds',
    header: () => (
      <RecordTable.InlineHead icon={IconAlignLeft} label="Positions" />
    ),
    cell: ({ cell }) => {
      const { _id } = cell.row.original;
      const { usersEdit } = useUserEdit();

      return (
        <SelectPositions.InlineCell
          scope={
            SettingsHotKeyScope.UsersPage +
            '.' +
            cell.row.original._id +
            '.Position'
          }
          mode="multiple"
          value={cell.getValue() as string[]}
          onValueChange={(value) =>
            usersEdit(
              {
                variables: {
                  _id,
                  positionIds: value,
                },
              },
              ['positionIds'],
            )
          }
        />
      );
    },
    size: 240,
  },
  {
    id: 'workStartedDate',
    accessorKey: 'workStartedDate',
    header: () => (
      <RecordTable.InlineHead icon={IconAlignLeft} label="workStartedDate" />
    ),
    cell: ({ cell }) => {
      const { details, _id } = cell.row.original;
      const { workStartedDate, ...rest } = details || {};
      const [open, setOpen] = useState<boolean>(false);
      const [_workStartedDate, setWorkStartedDate] = useState<Date>(
        workStartedDate || new Date(),
      );
      const { usersEdit } = useUserEdit();
      const onSave = () => {
        usersEdit(
          {
            variables: {
              _id,
              details: {
                ...rest,
                workStartedDate: _workStartedDate,
              },
            },
          },
          ['details'],
        );
      };

      const onChange = (date: Date) => {
        if (date === workStartedDate) return;
        setWorkStartedDate(date);
      };

      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            {(_workStartedDate &&
              format(new Date(_workStartedDate), 'yyyy/MM/dd')) ||
              'YYYY/MM/DD'}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <DatePicker
              value={_workStartedDate}
              onChange={(d) => onChange(d as Date)}
            />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: () => <RecordTable.InlineHead icon={IconChecks} label="Status" />,
    cell: ({ cell }) => {
      const { _id } = cell.row.original || {};
      const { editStatus } = useUsersStatusEdit();
      return (
        <RecordTableCellDisplay>
          <Switch
            className="mx-auto"
            checked={cell.getValue() as boolean}
            onCheckedChange={() => {
              editStatus({
                variables: {
                  _id,
                },
              });
            }}
          />
        </RecordTableCellDisplay>
      );
    },
  },
];
