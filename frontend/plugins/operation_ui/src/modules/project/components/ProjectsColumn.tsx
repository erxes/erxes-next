/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from 'react-router';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
import { IconLabelFilled, IconProgressCheck } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { StatusSelect } from '@/project/components/StatusSelect';
import { TargetDateSelect } from '@/project/components/TargetDateSelect';
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
import { ProjectHotKeyScope } from '@/project/ProjectHotKeyScope';
import { PrioritySelect } from '@/project/components/PrioritySelect';
import { LeadSelect } from '@/project/components/LeadSelect';

export const projectsColumns: ColumnDef<IProject>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      const name = cell.getValue() as string;
      const [value, setValue] = useState(name);
      const { updateProject } = useUpdateProject();
      const navigate = useNavigate();
      return (
        <RecordTablePopover
          scope={
            ProjectHotKeyScope.ProjectTableCell +
            '.' +
            cell.row.original._id +
            '.Name'
          }
          closeOnEnter
          onOpenChange={(open) => {
            if (!open && value !== name) {
              updateProject({
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
                navigate(`/operation/projects/${cell.row.original._id}`);
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
      <RecordTable.InlineHead label="Priority" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return (
        <PrioritySelect
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
        <StatusSelect
          value={cell.row.original.status || 0}
          id={cell.row.original._id}
        />
      );
    },
    size: 170,
  },

  {
    id: 'Lead',
    header: () => (
      <RecordTable.InlineHead label="Lead" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return (
        <LeadSelect
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
      <RecordTable.InlineHead label="Target Date" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      const targetDate = cell.getValue() as string;
      return (
        <TargetDateSelect
          value={targetDate ? new Date(targetDate) : undefined}
          id={cell.row.original._id}
        />
      );
    },
    size: 240,
  },
];
