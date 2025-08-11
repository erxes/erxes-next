/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from 'react-router';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import {
  IconAlertSquareRounded,
  IconClipboard,
  IconCalendarFilled,
  IconHash,
  IconLabelFilled,
  IconProgressCheck,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  SelectStatus,
  SelectPriority,
  SelectAssignee,
  SelectTeam,
  DateSelect,
} from '@/task/components/select';
import { SelectProject } from '@/task/components/select/SelectProject';
import {
  Badge,
  Input,
  RecordTable,
  RecordTableInlineCell,
  Popover,
} from 'erxes-ui';
import { ITask } from '~/modules/task/types';
import { useState } from 'react';
import { ITeam } from '@/team/types';
import { TaskHotKeyScope } from '@/task/TaskHotkeyScope';
import { SelectEstimatedPoint } from '@/task/components/select/SelectEstimatedPoint';

export const tasksColumns = (
  _teams: ITeam[] | undefined,
): ColumnDef<ITask>[] => {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: () => (
        <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
      ),
      cell: ({ cell }) => {
        const name = cell.getValue() as string;
        const [value, setValue] = useState(name);
        const { updateTask } = useUpdateTask();
        const navigate = useNavigate();

        const handleUpdate = () => {
          if (value !== name) {
            updateTask({
              variables: { _id: cell.row.original._id, name: value },
            });
          }
        };

        return (
          <Popover
            closeOnEnter
            onOpenChange={(open) => {
              if (!open) {
                handleUpdate();
              }
            }}
            scope={
              TaskHotKeyScope.TaskTableCell +
              '.' +
              cell.row.original._id +
              '.Name'
            }
          >
            <RecordTableInlineCell.Trigger>
              <Badge
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/operation/tasks/${cell.row.original._id}`);
                }}
              >
                {name}
              </Badge>
            </RecordTableInlineCell.Trigger>
            <RecordTableInlineCell.Content className="min-w-72">
              <Input
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUpdate();
                  }
                }}
              />
            </RecordTableInlineCell.Content>
          </Popover>
        );
      },
      size: 240,
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: () => (
        <RecordTable.InlineHead
          label="Priority"
          icon={IconAlertSquareRounded}
        />
      ),
      cell: ({ cell }) => {
        return (
          <SelectPriority.InlineCell
            value={cell.row.original.priority || 0}
            id={cell.row.original._id}
          />
        );
      },
      size: 170,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => (
        <RecordTable.InlineHead label="Status" icon={IconProgressCheck} />
      ),
      cell: ({ cell }) => {
        return (
          <SelectStatus.InlineCell
            teamId={cell.row.original.teamId}
            value={cell.row.original.status || 0}
            id={cell.row.original._id}
          />
        );
      },
      size: 170,
    },
    {
      id: 'assigneeId',
      header: () => <RecordTable.InlineHead label="Assignee" icon={IconUser} />,
      cell: ({ cell }) => {
        return (
          <SelectAssignee.InlineCell
            id={cell.row.original._id}
            value={cell.row.original.assigneeId}
            teamIds={[cell.row.original.teamId]}
          />
        );
      },
      size: 240,
    },
    {
      id: 'estimatedPoint',
      accessorKey: 'estimatedPoint',
      header: () => (
        <RecordTable.InlineHead label="Estimated Point" icon={IconHash} />
      ),
      cell: ({ cell }) => {
        return (
          <SelectEstimatedPoint.InlineCell
            estimateChoices={cell.row.original.estimateChoices}
            value={cell.row.original.estimatedPoint || 0}
            id={cell.row.original._id}
          />
        );
      },
      size: 240,
    },
    {
      id: 'project',
      accessorKey: 'project',
      header: () => (
        <RecordTable.InlineHead label="Project" icon={IconClipboard} />
      ),
      cell: ({ cell }) => {
        const { updateTask } = useUpdateTask();

        return (
          <SelectProject.InlineCell
            value={cell.row.original.projectId || ''}
            onValueChange={(value) => {
              updateTask({
                variables: { _id: cell.row.original._id, projectId: value },
              });
            }}
          />
        );
      },
      size: 240,
    },

    {
      id: 'teamId',
      header: () => (
        <RecordTable.InlineHead label="Team" icon={IconUsersGroup} />
      ),
      cell: ({ cell }) => {
        return (
          <SelectTeam.InlineCell
            id={cell.row.original._id}
            value={cell.row.original.teamId}
            teams={_teams || []}
            mode="single"
          />
        );
      },
      size: 240,
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: () => (
        <RecordTable.InlineHead label="Start Date" icon={IconCalendarFilled} />
      ),
      cell: ({ cell }) => {
        const startDate = cell.getValue() as string;
        return (
          <DateSelect.InlineCell
            type="start"
            value={startDate ? new Date(startDate) : undefined}
            id={cell.row.original._id}
          />
        );
      },
      size: 240,
    },
    {
      id: 'targetDate',
      accessorKey: 'targetDate',
      header: () => (
        <RecordTable.InlineHead label="Target Date" icon={IconCalendarFilled} />
      ),
      cell: ({ cell }) => {
        const targetDate = cell.getValue() as string;
        return (
          <DateSelect.InlineCell
            type="target"
            value={targetDate ? new Date(targetDate) : undefined}
            id={cell.row.original._id}
          />
        );
      },
      size: 240,
    },
  ];
};
