import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  type Table,
  type TableOptions,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  createContext,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  useContext,
} from 'react';
import { type ReactNode, useMemo, useState } from 'react';
import {
  DragEndEvent,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  DndContext,
  closestCenter,
} from '@dnd-kit/core';

import { arrayMove } from '@dnd-kit/sortable';
import {
  restrictToFirstScrollableAncestor,
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers';
import { cn } from 'erxes-ui/lib/utils';

type IRecordTableContext = {
  table: Table<any>;
  handleReachedBottom?: () => void;
};

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

export const RecordTableProvider = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    columns: ColumnDef<any>[];
    data: any[];
    tableOptions?: TableOptions<any>;
    handleReachedBottom?: () => void;
  }
>(
  (
    {
      children,
      columns,
      data,
      tableOptions,
      handleReachedBottom,
      className,
      ...props
    },
    ref
  ) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      {}
    );
    const [rowSelection, setRowSelection] = useState({});
    const [columnOrder, setColumnOrder] = useState<string[]>(() =>
      columns.map((c) => c.id ?? '')
    );

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          delay: 300,
          tolerance: 10,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 300,
          tolerance: 10,
        },
      }),
      useSensor(KeyboardSensor, {})
    );

    const table = useReactTable({
      data,
      columns,
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
        columnVisibility,
      },
      columnResizeMode: 'onChange',
      onColumnOrderChange: setColumnOrder,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onRowSelectionChange: setRowSelection,
      onColumnVisibilityChange: setColumnVisibility,
      ...tableOptions,
    });

    const columnSizeVars = useMemo(() => {
      const headers = table.getFlatHeaders();
      const colSizes: { [key: string]: number } = {};
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header) {
          colSizes[`--header-${header.id}-size`] = header.getSize();
          colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
        }
      }
      return colSizes;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        setColumnOrder((columnOrder) => {
          const oldIndex = columnOrder.indexOf(active.id as string);
          const newIndex = columnOrder.indexOf(over.id as string);
          return arrayMove(
            columnOrder,
            oldIndex,
            newIndex === columnOrder.length - 1 ? newIndex - 1 : newIndex
          ); //this is just a splice util
        });
      }
    }

    return (
      <RecordTableContext.Provider value={{ table, handleReachedBottom }}>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[
            restrictToHorizontalAxis,
            restrictToFirstScrollableAncestor,
          ]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          autoScroll={false}
        >
          <div
            {...props}
            style={
              {
                '--table-width': table.getTotalSize() + 'px',
                ...columnSizeVars,
              } as CSSProperties
            }
            className={cn(className)}
          >
            {children}
          </div>
        </DndContext>
      </RecordTableContext.Provider>
    );
  }
);
