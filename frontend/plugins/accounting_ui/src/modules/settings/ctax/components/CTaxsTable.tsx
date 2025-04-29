import { useCTaxRows } from '../hooks/useCTaxRows';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { ICtax } from '../types/CTax';
import { RecordTable } from 'erxes-ui';

export const CTaxRowsTable = () => {
  const { ctaxRows, loading, handleFetchMore, totalCount } = useCTaxRows();

  return (
    <RecordTable.Provider
      columns={ctaxRowsColumns}
      data={ctaxRows || []}
      handleReachedBottom={handleFetchMore}
      moreColumn={ctaxMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > ctaxRows?.length && (
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

export const ctaxRowsColumns: ColumnDef<ICtax>[] = [
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

export const CtaxMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ICtax, unknown>;
}) => {
  return <RecordTable.MoreButton />;
};

export const ctaxMoreColumn = {
  id: 'more',
  cell: CtaxMoreColumnCell,
  size: 33,
};
