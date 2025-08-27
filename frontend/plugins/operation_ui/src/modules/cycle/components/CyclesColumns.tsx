/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate, useParams } from 'react-router';
import { IconCalendarFilled, IconLabelFilled } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { DateSelect } from '@/cycle/components/DateSelect';
import {
  Badge,
  Input,
  RecordTable,
  RecordTableInlineCell,
  PopoverScoped,
} from 'erxes-ui';
import { ICycle } from '@/cycle/types';
import { useState } from 'react';
import { CycleHotKeyScope } from '@/cycle/CycleHotkeyScope';
import { useUpdateCycle } from '@/cycle/hooks/useUpdateCycle';
import clsx from 'clsx';
import { CircularProgressBar } from '@/cycle/components/CircularProgressBar';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<ICycle>;
export const cyclesColumns: ColumnDef<ICycle>[] = [
  checkBoxColumn,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      const name = cell.getValue() as string;
      const [value, setValue] = useState(name);
      const { updateCycle } = useUpdateCycle();
      const { teamId, projectId } = useParams();
      const navigate = useNavigate();

      const handleUpdate = () => {
        if (value !== name) {
          updateCycle({
            variables: { input: { _id: cell.row.original._id, name: value } },
          });
        }
      };

      const url =
        teamId && !projectId
          ? `/operation/team/${teamId}/tasks/${cell.row.original._id}`
          : `/operation/tasks/${cell.row.original._id}`;

      return (
        <PopoverScoped
          closeOnEnter
          onOpenChange={(open) => {
            if (!open) {
              handleUpdate();
            }
          }}
          scope={clsx(
            CycleHotKeyScope.CycleTableCell,
            cell.row.original._id,
            'Name',
          )}
        >
          <RecordTableInlineCell.Trigger>
            <Badge
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(url);
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
        </PopoverScoped>
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
      console.log(startDate);
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
    id: 'endDate',
    accessorKey: 'endDate',
    header: () => (
      <RecordTable.InlineHead label="End Date" icon={IconCalendarFilled} />
    ),
    cell: ({ cell }) => {
      const { endDate, startDate } = cell.row.original;
      return (
        <DateSelect.InlineCell
          startDate={startDate ? new Date(startDate) : undefined}
          type="end"
          value={endDate ? new Date(endDate) : undefined}
          id={cell.row.original._id}
        />
      );
    },
    size: 240,
  },
  {
    id: 'donePercent',
    accessorKey: 'donePercent',
    header: () => (
      <RecordTable.InlineHead label="End Date" icon={IconCalendarFilled} />
    ),
    cell: ({ cell }) => {
      const { donePercent } = cell.row.original;
      return (
        <CircularProgressBar percentage={50} />
      );
    },
    size: 240,
  },
];
