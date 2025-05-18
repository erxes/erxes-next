import { gql, useQuery } from '@apollo/client';
import { Button } from 'erxes-ui/components';
import { Link } from 'react-router-dom';
import queries from '../graphql/queries';
import { IAutomation, IAutomationDoc } from '../types';
import { IPageInfo, SelectTags } from 'ui-modules';
import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
export const columns: ColumnDef<IAutomation>[] = [
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
    size: 13,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
  },
  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTable.InlineHead label="Tags" />,
    cell: ({ cell }) => {
      const [selectedTags, setSelectedTags] = useState<string[]>(
        cell.row.original.tagIds || [],
      );
      const [open, setOpen] = useState(false);

      return (
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
      );
    },
  },
];
