import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableCellDisplay,
  RecordTableTree,
  useQueryState,
} from 'erxes-ui';
import { Button } from 'erxes-ui/components';
import { IconEdit } from '@tabler/icons-react';
import { ISegment } from 'ui-modules';

const columns: ColumnDef<{ order: string; hasChildren: boolean } & ISegment>[] =
  [
    {
      id: 'name',
      accessorKey: 'name',
      header: () => <RecordTable.InlineHead label="Name" />,
      cell: ({ cell, row }) => {
        const { name } = cell.row.original;

        return (
          <RecordTableTree.Trigger
            order={cell.row.original.order}
            name={cell.getValue() as string}
            hasChildren={cell.row.original.hasChildren}
          >
            {cell.getValue() as string}
          </RecordTableTree.Trigger>
        );
      },
    },

    {
      id: 'description',
      accessorKey: 'description',
      header: () => <RecordTable.InlineHead label="Description" />,
      cell: ({ cell }) => {
        return (
          <RecordTableCellDisplay>
            {cell.getValue() as string}
          </RecordTableCellDisplay>
        );
      },
    },
    {
      id: 'count',
      accessorKey: 'count',
      header: () => <RecordTable.InlineHead label="Count" />,
      cell: ({ cell }) => {
        const { count } = cell.row.original;
        return (
          <RecordTableCellDisplay>
            {cell.getValue() as string}
          </RecordTableCellDisplay>
        );
      },
    },
    {
      id: 'actions',
      header: () => <RecordTable.InlineHead label="" />,
      cell: ({ cell }) => {
        const [, setOpen] = useQueryState('segmentId');
        return (
          <RecordTableCellDisplay>
            <Button
              variant="ghost"
              className="w-full h-full"
              onClick={() => setOpen(cell.row.original._id)}
            >
              <IconEdit className="hover:text-accent-foreground" />
            </Button>
          </RecordTableCellDisplay>
        );
      },
    },
  ];

export default columns;
