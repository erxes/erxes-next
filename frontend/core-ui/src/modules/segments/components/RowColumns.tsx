import { ColumnDef } from '@tanstack/table-core';
import { useQueryState } from 'erxes-ui/hooks';
import { RecordTable } from 'erxes-ui/modules';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';

const columns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell, row }) => {
      const { name } = cell?.row?.original || {};

      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => (
            <div>
              {row.getCanExpand() ? (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {row.getIsExpanded() ? '▼' : '►'} {name}
                </button>
              ) : (
                <span>{name}</span>
              )}
            </div>
          )}
        />
      );
    },
  },

  {
    id: 'description',
    accessorKey: 'description',
    header: () => <RecordTable.InlineHead label="Description" />,
    cell: ({ cell }) => {
      const { description } = cell?.row?.original || {};
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
      const { count } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => <div>{count}</div>}
        />
      );
    },
  },
];

export default columns;
