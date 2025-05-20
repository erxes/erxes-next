import { ColumnDef } from '@tanstack/table-core';
import { useQueryState } from 'erxes-ui/hooks';
import { RecordTable, RecordTableTree } from 'erxes-ui/modules/record-table';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { Button } from 'erxes-ui/components';
import { IconEdit } from '@tabler/icons-react';
import { ISegment } from '../../../../../libs/ui-modules/src/modules/segments/types';

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
        const { description } = cell.row.original;
        return (
          <RecordTableInlineCell
            containerClassName="justify-center"
            display={() => <div>{description}</div>}
          />
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
          <RecordTableInlineCell
            containerClassName="justify-center"
            display={() => <div>{count}</div>}
          />
        );
      },
    },
    {
      id: 'actions',
      header: () => <RecordTable.InlineHead label="" />,
      cell: ({ cell }) => {
        const [, setOpen] = useQueryState('segmentId');
        return (
          <RecordTableInlineCell
            containerClassName="justify-center"
            display={() => (
              <Button
                variant="ghost"
                className="w-full h-full"
                onClick={() => setOpen(cell.row.original._id)}
              >
                <IconEdit className="hover:text-accent-foreground" />
              </Button>
            )}
          />
        );
      },
    },
  ];

export default columns;
