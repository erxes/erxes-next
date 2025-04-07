import { useVatRows } from '../hooks/useVatRows';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { IVat } from '../types/Vat';
import { RecordTable } from 'erxes-ui';

export const VatRowsTable = () => {
  const { vatRows, loading, handleFetchMore, totalCount } = useVatRows();

  return (
    <RecordTable.Provider
      columns={vatRowsColumns}
      data={vatRows || []}
      handleReachedBottom={handleFetchMore}
      moreColumn={vatMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > vatRows?.length && (
            <RecordTable.RowSkeleton
              rows={4}
              handleReachedBottom={handleFetchMore}
            />
          )}
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};

export const vatRowsColumns: ColumnDef<IVat>[] = [
  {
    id: 'number',
    accessorKey: 'number',
    header: () => <RecordTable.InlineHead label="Number" />,
    cell: ({ cell }) => {
      return <div>{cell.getValue() as string}</div>;
    },
    size: 250,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => {
      return <div>{cell.getValue() as string}</div>;
    },
    size: 250,
  },
  {
    id: 'kind',
    accessorKey: 'kind',
    header: () => <RecordTable.InlineHead label="Kind" />,
    cell: ({ cell }) => {
      return <div>{cell.getValue() as string}</div>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => {
      return <div>{cell.getValue() as string}</div>;
    },
  },
  {
    id: 'percent',
    accessorKey: 'percent',
    header: () => <RecordTable.InlineHead label="Percent" />,
    cell: ({ cell }) => {
      return <div>{cell.getValue() as string}</div>;
    },
  },
];

export const VatMoreColumnCell = ({ cell }: { cell: Cell<IVat, unknown> }) => {
  return <RecordTable.MoreButton />;
};

export const vatMoreColumn = {
  id: 'more',
  cell: VatMoreColumnCell,
  size: 33,
};
