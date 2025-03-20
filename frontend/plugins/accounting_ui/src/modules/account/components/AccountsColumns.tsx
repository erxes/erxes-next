import { ColumnDef } from '@tanstack/react-table';
import { IAccount } from '../type/Account';
import {
  CurrencyCode,
  CurrencyDisplay,
  InlineCell,
  InlineCellDisplay,
  RecordTable,
} from 'erxes-ui';

export const accountsColumns: ColumnDef<IAccount>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.row.original.name}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
    size: 320,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead label="Code" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.row.original.code}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'categoryId',
    header: () => <RecordTable.InlineHead label="Category" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.column.id}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
    size: 240,
  },
  {
    id: 'currency',
    accessorKey: 'currency',
    header: () => <RecordTable.InlineHead label="Currency" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.column.id}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay className="[&_svg]:size-4">
              <CurrencyDisplay code={cell.getValue() as CurrencyCode} />
            </InlineCellDisplay>
          )}
        />
      );
    },
    size: 120,
  },
  {
    id: 'kind',
    accessorKey: 'kind',
    header: () => <RecordTable.InlineHead label="Kind" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.column.id}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
  {
    id: 'journal',
    accessorKey: 'journal',
    header: () => <RecordTable.InlineHead label="Journal" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.column.id}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
];
