import React from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeData, Product } from './makeData';
import { cn, ScrollArea, Table } from 'erxes-ui';
import { format } from 'date-fns';
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
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  getCommonPinningStyles,
  getCommonPinningClassName,
} from '../utils/tableUtils';
import ExampleTableHead from './ExampleTableHead';

const defaultColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'title',
    id: 'title',
    header: 'Title',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 280,
  },
  {
    accessorKey: 'price',
    id: 'price',
    header: 'Price',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: 'Category',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Created At',
    footer: (props) => props.column.id,
    cell: (info) => format(info.getValue() as Date, 'yyyy-MM-dd'),
    size: 180,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Updated At',
    footer: (props) => props.column.id,
    cell: (info) => format(info.getValue() as Date, 'yyyy-MM-dd'),
    size: 180,
  },
  {
    accessorKey: 'tags',
    id: 'tags',
    header: 'Tags',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'vendor',
    id: 'vendor',
    header: 'Vendor',
    footer: (props) => props.column.id,
    size: 280,
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: 'Type',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'code',
    id: 'code',
    header: 'Code',
    footer: (props) => props.column.id,
    size: 180,
  },
];

function ExampleTwo() {
  const [data] = React.useState(() => makeData(300));
  const [columns] = React.useState(() => [...defaultColumns]);
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!)
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: 'onChange',
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

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <ScrollArea.Root>
        <Table.Root
          style={{
            width: table.getTotalSize(),
          }}
        >
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header, idx) => (
                    <ExampleTableHead header={header} key={idx} />
                  ))}
                </SortableContext>
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  return (
                    <Table.Cell
                      key={cell.id}
                      //IMPORTANT: This is where the magic happens!
                      className={cn(
                        getCommonPinningClassName(column),
                        'bg-background'
                      )}
                      style={getCommonPinningStyles(column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <ScrollArea.Bar orientation="horizontal" className="z-[4]" />
      </ScrollArea.Root>
    </DndContext>
  );
}

export default ExampleTwo;
