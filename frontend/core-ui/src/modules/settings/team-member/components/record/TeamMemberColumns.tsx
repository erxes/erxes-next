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
  InlineCell,
  Switch,
  useQueryState,
  RecordTable,
  RecordTablePopover,
  RecordTableCellTrigger,
  Input,
  RecordTableCellContent,
  TextOverflowTooltip,
  FullNameField,
  RecordTableCellDisplay,
  DatePicker,
} from 'erxes-ui';
import { IUser } from '@/settings/team-member/types';
import { useSetAtom } from 'jotai';
import { renderingTeamMemberDetailAtom } from '../../states/renderingTeamMemberDetail';
import { SelectPositions } from 'ui-modules';
import { useUserEdit, useUsersStatusEdit } from '../../hooks/useUserEdit';
import { ChangeEvent, useState } from 'react';
import { TeammemberEmailField } from './team-member-edit/TeammemberEmailField';
import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { format } from 'date-fns';

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
      const [_firstName, setFirstName] = useState(firstName);
      const [_lastName, setLastName] = useState(lastName);
      const [open, setOpen] = useState(false);

      const onSave = () => {
        if (_firstName !== firstName || _lastName !== lastName) {
          usersEdit(
            {
              variables: {
                _id,
                details: {
                  ...details,
                  firstName: _firstName,
                  lastName: _lastName,
                },
              },
            },
            ['details'],
          );
        }
      };

      return (
        <RecordTablePopover
          scope={SettingsHotKeyScope.UsersPage + '.' + _id + '.Name'}
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            <Badge
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setDetailOpen(_id);
                setRenderingTeamMemberDetail(false);
              }}
            >
              {firstName || lastName ? (
                <span>
                  {firstName} {lastName}
                </span>
              ) : (
                <span className="text-muted-foreground">Unnamed user</span>
              )}
            </Badge>
          </RecordTableCellTrigger>
          <RecordTableCellContent className="w-72" asChild>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave();
                setOpen(false);
              }}
            >
              <FullNameField>
                <FullNameField.FirstName
                  value={_firstName || ''}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <FullNameField.LastName
                  value={_lastName || ''}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </FullNameField>
              <button type="submit" className="sr-only" />
            </form>
          </RecordTableCellContent>
        </RecordTablePopover>
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
        <InlineCell
          name="status"
          className="flex items-center justify-center"
          recordId={cell.row.original._id}
          display={() => {
            return (
              <Badge
                variant={
                  !status || status === 'Not verified'
                    ? 'destructive'
                    : 'success'
                }
              >
                {status || 'Not verified'}
              </Badge>
            );
          }}
        />
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <RecordTable.InlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => <TeammemberEmailField cell={cell} />,
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
      const { positionIds, _id } = cell.row.original;
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
      const [_workStartedDate, setWorkStartedDate] =
        useState<Date>(workStartedDate);
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
        <InlineCell
          name="isActive"
          className="flex items-center justify-center"
          recordId={cell.row.original._id}
          display={() => (
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
          )}
        />
      );
    },
  },
];
