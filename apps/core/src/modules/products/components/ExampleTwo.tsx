import React, { CSSProperties } from 'react';

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeData, Product } from './makeData';
import { faker } from '@faker-js/faker';
import { cn, ScrollArea, ScrollBar, Table } from 'erxes-ui';
import { ScrollAreaThumb } from '@radix-ui/react-scroll-area';
import { format } from 'date-fns';

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = (column: Column<Product>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
      ? '4px 0 4px -4px gray inset'
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

const getCommonPinningClassName = (column: Column<Product>) => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return cn(
    'sticky z-[2] top-0 bg-background',
    isPinned === 'left' && 'sticky left-0 z-[3] bg-background',
    isLastLeftPinnedColumn && 'sticky left-0 z-[3] bg-background',
    isFirstRightPinnedColumn && 'sticky right-0 z-[3] bg-background'
  );
};

const defaultColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'title',
    id: 'title',
    header: 'Title',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
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
    size: 180,
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
  const [data, setData] = React.useState(() => makeData(300));
  const [columns] = React.useState(() => [...defaultColumns]);

  const rerender = () => setData(() => makeData(30));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: 'onChange',
  });

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id))
    );
  };

  return (
    <ScrollArea>
      <Table.Root
        style={{
          width: table.getTotalSize(),
        }}
      >
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => {
                const { column } = header;

                return (
                  <Table.Head
                    key={header.id}
                    colSpan={header.colSpan}
                    //IMPORTANT: This is where the magic happens!
                    style={{ ...getCommonPinningStyles(column) }}
                    className={cn(
                      'sticky z-[2] top-0 bg-background',
                      idx === 0 && 'sticky left-0 z-[3] bg-background'
                    )}
                  >
                    <div className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}{' '}
                      {/* Demo getIndex behavior */}
                      {column.getIndex(column.getIsPinned() || 'center')}
                    </div>
                    {!header.isPlaceholder && header.column.getCanPin() && (
                      <div className="flex gap-1 justify-center">
                        {header.column.getIsPinned() !== 'left' ? (
                          <button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin('left');
                            }}
                          >
                            {'<='}
                          </button>
                        ) : null}
                        {header.column.getIsPinned() ? (
                          <button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin(false);
                            }}
                          >
                            X
                          </button>
                        ) : null}
                        {header.column.getIsPinned() !== 'right' ? (
                          <button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin('right');
                            }}
                          >
                            {'=>'}
                          </button>
                        ) : null}
                      </div>
                    )}
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                      }}
                    />
                  </Table.Head>
                );
              })}
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
                    style={{ ...getCommonPinningStyles(column) }}
                    className="bg-background"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default ExampleTwo;
