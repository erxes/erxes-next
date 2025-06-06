import { IconPointerBolt, IconShare } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Avatar,
  Badge,
  cn,
  RecordTable,
  readFile,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IAction, ITrigger, SelectTags } from 'ui-modules';
import { IAutomation } from '../types';
import { IUser } from '@/settings/team-member/types';
export const automationColumns: ColumnDef<IAutomation>[] = [
  {
    id: 'more',
    cell: ({ cell }) => {
      const { _id } = cell.row.original;
      return (
        <Link to={`/automations/edit/${_id}`}>
          <RecordTable.MoreButton className="w-full h-full" />
        </Link>
      );
    },
    size: 40,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    minSize: 120,
    maxSize: 240,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => {
      const status = cell.getValue() as 'active' | 'draft';
      return (
        <div className="w-full flex justify-center">
          <Badge
            variant={status === 'active' ? 'success' : 'secondary'}
            className={cn('font-bold', {
              'text-accent-foreground': status !== 'active',
            })}
          >
            {status}
          </Badge>
        </div>
      );
    },
    size: 80,
  },
  {
    id: 'triggers',
    accessorKey: 'triggers',
    header: () => <RecordTable.InlineHead label="Triggers" />,
    cell: ({ cell }) => {
      const triggers = (cell.getValue() || []) as ITrigger[];
      return (
        <RecordTableCellDisplay>
          <IconPointerBolt size={12} />
          {triggers?.length}
        </RecordTableCellDisplay>
      );
    },
    size: 80,
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: () => <RecordTable.InlineHead label="Actions" />,
    cell: ({ cell }) => {
      const actions = (cell.getValue() || []) as IAction[];
      return (
        <RecordTableCellDisplay>
          <IconShare size={12} />
          {actions?.length}
        </RecordTableCellDisplay>
      );
    },
    size: 80,
  },
  {
    id: 'updatedUser',
    accessorKey: 'updatedUser',
    header: () => <RecordTable.InlineHead label="Last Updated By" />,
    cell: ({ cell }) => {
      const { details } = (cell.getValue() || {}) as IUser;
      return (
        <RecordTableCellDisplay>
          <Avatar className="h-6 w-6 rounded-full">
            <Avatar.Image
              src={readFile(details?.avatar)}
              alt={details?.fullName || ''}
            />
            <Avatar.Fallback className="rounded-lg">
              {(details?.fullName || '').split('')[0]}
            </Avatar.Fallback>
          </Avatar>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'createdUser',
    accessorKey: 'createdUser',
    header: () => <RecordTable.InlineHead label="Created By" />,
    cell: ({ cell }) => {
      const { details } = (cell.getValue() || {}) as IUser;
      return (
        <RecordTableCellDisplay>
          <Avatar className="h-6 w-6 rounded-full">
            <Avatar.Image
              src={readFile(details?.avatar)}
              alt={details?.fullName || ''}
            />
            <Avatar.Fallback className="rounded-lg">
              {(details?.fullName || '').split('')[0]}
            </Avatar.Fallback>
          </Avatar>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: () => <RecordTable.InlineHead label="Last Updated At" />,
    cell: ({ cell }) => {
      return (
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableCellDisplay>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableCellDisplay>
        </RelativeDateDisplay>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <RecordTable.InlineHead label="Created At" />,
    cell: ({ cell }) => {
      return (
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableCellDisplay>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableCellDisplay>
        </RelativeDateDisplay>
      );
    },
  },
  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTable.InlineHead label="Tags" />,
    cell: ({ cell }) => {
      const [selectedTags, setSelectedTags] = useState<string[]>(
        (cell.getValue() || []) as string[],
      );
      const [open, setOpen] = useState(false);

      return (
        <RecordTableCellDisplay>
          <SelectTags
            tagType="automations:automations"
            mode="single"
            value={selectedTags}
            onValueChange={(tags) => {
              if (Array.isArray(tags)) {
                setSelectedTags(tags);
                setOpen(false);
              }
            }}
          >
            <RecordTablePopover open={open} onOpenChange={setOpen}>
              <RecordTableCellTrigger>
                <SelectTags.Value />
              </RecordTableCellTrigger>
              <RecordTableCellContent className="w-96">
                <SelectTags.Content />
              </RecordTableCellContent>
            </RecordTablePopover>
          </SelectTags>
        </RecordTableCellDisplay>
      );
    },
  },
];
