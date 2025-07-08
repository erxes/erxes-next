import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableCellDisplay,
  RecordTableTree,
  useQueryState,
  Button,
} from 'erxes-ui';
import { IconEdit } from '@tabler/icons-react';
import { ISegment } from 'ui-modules';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<
  { order: string; hasChildren: boolean } & ISegment
>;

const columns: ColumnDef<{ order: string; hasChildren: boolean } & ISegment>[] =
  [
    checkBoxColumn,
    {
      id: 'name',
      accessorKey: 'name',
      header: () => <RecordTable.InlineHead label="Name" />,
      cell: ({ cell, row }) => {
        return (
          <RecordTableTree.Trigger
            order={cell.row.original.order}
            name={cell.getValue() as string}
            hasChildren={cell.row.original.hasChildren}
            className="pl-2"
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
      size: 40,
    },
  ];

export default columns;
