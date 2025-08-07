/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from 'react-router';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import {
  IconAlertSquareRounded,
  IconCalendarFilled,
  IconLabelFilled,
  IconProgressCheck,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { SelectStatus } from '@/project/components/select/SelectStatus';
<<<<<<< HEAD
// import { TargetDateSelect } from '@/project/components/select/TargetDateSelect';
=======
import { TargetDateSelect } from '@/project/components/select/TargetDateSelect';
>>>>>>> 9b54ffef (update)
import {
  Badge,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';
import { IProject } from '@/project/types';
import { useState } from 'react';
<<<<<<< HEAD
// import { ProjectHotKeyScope } from '@/project/types';
=======
import { ProjectHotKeyScope } from '@/project/types';
>>>>>>> 9b54ffef (update)
import { SelectPriority } from '@/project/components/select/SelectPriority';
import { SelectLead } from '@/project/components/select/SelectLead';
import { ITeam } from '@/team/types';
import { SelectTeam } from '@/project/components/select/SelectTeam';

export const tasksColumns = (
  _teams: ITeam[] | undefined,
): ColumnDef<IProject>[] => {
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
        return (
          <RecordTablePopover
            scope={
<<<<<<< HEAD
              //   ProjectHotKeyScope.ProjectTableCell +
              '.' + cell.row.original._id + '.Name'
=======
              ProjectHotKeyScope.ProjectTableCell +
              '.' +
              cell.row.original._id +
              '.Name'
>>>>>>> 9b54ffef (update)
            }
            closeOnEnter
            onOpenChange={(open) => {
              if (!open && value !== name) {
                updateTask({
                  variables: { _id: cell.row.original._id, name: value },
                });
              }
            }}
          >
            <RecordTableCellTrigger>
              <Badge
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/operation/tasks/${cell.row.original._id}`);
                }}
              >
                {name}
              </Badge>
            </RecordTableCellTrigger>
            <RecordTableCellContent className="min-w-72">
              <Input
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
              />
            </RecordTableCellContent>
          </RecordTablePopover>
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
            value={cell.row.original.status || 0}
            id={cell.row.original._id}
          />
        );
      },
      size: 170,
    },
    {
      id: 'teamIds',
      header: () => (
        <RecordTable.InlineHead label="Team" icon={IconUsersGroup} />
      ),
      cell: ({ cell }) => {
        return (
          <SelectTeam.InlineCell
            id={cell.row.original._id}
            value={cell.row.original.teamIds || []}
            teams={_teams || []}
          />
        );
      },
      size: 240,
    },
    {
      id: 'leadId',
      header: () => <RecordTable.InlineHead label="Lead" icon={IconUser} />,
      cell: ({ cell }) => {
        return (
          <SelectLead.InlineCell
            id={cell.row.original._id}
            value={cell.row.original.leadId}
            teamIds={cell.row.original.teamIds}
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
<<<<<<< HEAD
          <div>123</div>
          //   <TargetDateSelect
          //     value={targetDate ? new Date(targetDate) : undefined}
          //     id={cell.row.original._id}
          //   />
=======
          <TargetDateSelect
            value={targetDate ? new Date(targetDate) : undefined}
            id={cell.row.original._id}
          />
>>>>>>> 9b54ffef (update)
        );
      },
      size: 240,
    },
  ];
};
