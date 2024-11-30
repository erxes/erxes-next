import {
  ColumnDef,
  getCoreRowModel,
  type Table,
  type TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import React, { useContext } from 'react';
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
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { cn } from '../../lib/utils';

// resizing columns
// reordering columns
// filtering
// sorting
// virtual scrolling

type IRecordTableContext = {
  table: Table<any>;
};

const RecordTableContext = React.createContext<IRecordTableContext | null>(
  null
);

export function useRecordTable() {
  const context = useContext(RecordTableContext);
  if (!context) {
    throw new Error(
      'useRecordTable must be used within a RecordTableProvider.'
    );
  }

  return context;
}

export const RecordTableProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    columns: ColumnDef<any>[];
    data: any[];
    tableOptions?: TableOptions<any>;
  }
>(({ children, columns, data, tableOptions, className, ...props }, ref) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((c) => c.id ?? '')
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
      columnPinning: {
        left: ['checkbox', 'title'],
      },
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    ...tableOptions,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  return (
    <RecordTableContext.Provider value={{ table }}>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        autoScroll={{
          layoutShiftCompensation: false,
        }}
      >
        <div
          {...props}
          style={
            {
              '--table-width': table.getTotalSize() + 'px',
            } as React.CSSProperties
          }
          className={cn(className)}
        >
          {children}
        </div>
      </DndContext>
    </RecordTableContext.Provider>
  );
});
