import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  type TableOptions,
  useReactTable,
  RowSelectionState,
  ColumnOrderState,
  ColumnDef,
} from '@tanstack/react-table';
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  useContext,
  type ReactNode,
  useState,
} from 'react';
import { RecordTableDnDProvider } from 'erxes-ui/modules/record-table/components/RecordTableDnDProvider';
import { checkboxColumn } from 'erxes-ui/modules/record-table/components/CheckboxColumn';
import RecordTableContainer from 'erxes-ui/modules/record-table/components/RecordTableContainer';
import {
  GetFetchValueHook,
  IRecordTableColumn,
  IRecordTableContext,
} from 'erxes-ui/modules/record-table/types/recordTableTypes';
import RecordTableInlineCell from '../record-table-cell/components/RecordTableInlineCell';

const RecordTableContext = createContext<IRecordTableContext | null>(null);

export function useRecordTable() {
  const context = useContext(RecordTableContext);
  if (!context) {
    throw new Error(
      'useRecordTable must be used within a RecordTableProvider.'
    );
  }
  return context;
}

interface RecordTableProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns: IRecordTableColumn[];
  data: any[];
  tableOptions?: TableOptions<any>;
  handleReachedBottom?: () => void;
  getFetchValueHook: GetFetchValueHook;
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
      handleReachedBottom,
      className,
      getFetchValueHook,
      ...restProps
    },
    ref
  ) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const tableColumns: ColumnDef<any>[] = columns.map((column) => ({
      id: column.id,
      accessorKey: column.id,
      header: () => (
        <div className="flex items-center gap-1">
          <column.icon className="w-4 h-4" strokeWidth={2.5} /> {column.id}
        </div>
      ),
      size: 180,
      cell: (info) => (
        <RecordTableInlineCell
          type={column.type}
          {...info}
          readOnly={column.readOnly}
        />
      ),
    }));

    const table = useReactTable({
      data,
      columns: [checkboxColumn, ...tableColumns],
      defaultColumn: {
        minSize: 40,
        maxSize: 800,
      },
      getCoreRowModel: getCoreRowModel(),
      state: {
        columnOrder,
        columnPinning: {
          left: ['checkbox', 'name'],
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
        value={{ table, handleReachedBottom, getFetchValueHook }}
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
  }
);

RecordTableProvider.displayName = 'RecordTableProvider';
