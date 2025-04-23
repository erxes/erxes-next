import {
  createContext,
  forwardRef,
  HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  getCoreRowModel,
  RowSelectionState,
  SortingState,
  type TableOptions,
  useReactTable,
} from '@tanstack/react-table';

import { checkboxColumn } from 'erxes-ui/modules/record-table/components/CheckboxColumn';
import RecordTableContainer from 'erxes-ui/modules/record-table/components/RecordTableContainer';
import { RecordTableDnDProvider } from 'erxes-ui/modules/record-table/components/RecordTableDnDProvider';
import { IRecordTableContext } from 'erxes-ui/modules/record-table/types/recordTableTypes';

const RecordTableContext = createContext<IRecordTableContext | null>(null);

export function useRecordTable() {
  const context = useContext(RecordTableContext);
  if (!context) {
    throw new Error(
      'useRecordTable must be used within a RecordTableProvider.',
    );
  }
  return context;
}

interface RecordTableProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns: ColumnDef<any>[];
  data: any[];
  tableOptions?: TableOptions<any>;
  stickyColumns?: string[];
  moreColumn?: ColumnDef<any>;
}

export const RecordTableProvider = forwardRef<
  HTMLDivElement,
  RecordTableProviderProps
>(
  (
    {
      children,
      columns,
      data,
      tableOptions,
      className,
      stickyColumns,
      moreColumn,
      ...restProps
    },
    ref,
  ) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
      columns.map((c) => c.id || ''),
    );
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
      data,
      columns: [
        ...(moreColumn ? [moreColumn] : []),
        checkboxColumn,
        ...columns,
      ],
      defaultColumn: {
        maxSize: 800,
      },
      getCoreRowModel: getCoreRowModel(),
      state: {
        columnOrder,
        columnPinning: {
          left: ['more', 'checkbox', ...(stickyColumns || [])],
        },
        sorting,
        columnFilters,
        rowSelection,
      },
      columnResizeMode: 'onChange',
      onColumnOrderChange: setColumnOrder,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onRowSelectionChange: setRowSelection,
      ...tableOptions,
    });

    return (
      <RecordTableContext.Provider
        value={{
          table,
        }}
      >
        <RecordTableDnDProvider setColumnOrder={setColumnOrder}>
          <RecordTableContainer
            table={table}
            className={className}
            {...restProps}
            ref={ref}
          >
            {children}
          </RecordTableContainer>
        </RecordTableDnDProvider>
      </RecordTableContext.Provider>
    );
  },
);

RecordTableProvider.displayName = 'RecordTableProvider';
