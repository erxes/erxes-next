import React from 'react';
import {
  ColumnDef,
  Column,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { cn, ScrollArea, ScrollBar, Table } from 'erxes-ui';

const columnHelper = createColumnHelper();

const columns: ColumnDef<unknown>[] = []; // 100 columns
for (let i = 0; i < 100; i++) {
  columns.push(
    columnHelper.accessor(`COLUMN-${i}`, {
      header: () => `COLUMN-${i}`,
      isPinned: i === 0 ? 'left' : undefined,
    })
  );
}

const data = []; // 100 rows
for (let row = 0; row < 100; row++) {
  const rowData = {};
  for (let col = 0; col < 100; col++) {
    rowData[`COLUMN-${col}`] = `ROW-${row}--COLUMN-${col}`;
  }
  data.push(rowData);
}

const TableHead = (props) => {
  const { table } = props;

  return (
    <Table.Header className="font-medium">
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header, idx) => {
              const { columnDef } = header.column;

              return (
                <Table.Head
                  scope="col"
                  key={header.id}
                  className={cn(
                    'sticky z-[2] top-0 bg-background',
                    idx === 0 && 'sticky left-0 z-[3] bg-background'
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(columnDef.header, header.getContext())}
                </Table.Head>
              );
            })}
          </Table.Row>
        );
      })}
    </Table.Header>
  );
};

const TableBody = (props) => {
  const { table } = props;

  return (
    <Table.Body className="bg-white text-xs">
      {table.getRowModel().rows.map((row, idx) => (
        <Table.Row key={row.id} className="group">
          {row.getVisibleCells().map((cell, idx) => {
            const { columnDef } = cell.column;
            return (
              <Table.Cell
                key={cell.id}
                className={cn(
                  'whitespace-nowrap bg-background h-8 px-2',
                  idx === 0 && 'sticky left-0 z-[1] bg-slate-400'
                )}
              >
                {flexRender(columnDef.cell, cell.getContext())}
              </Table.Cell>
            );
          })}
        </Table.Row>
      ))}
    </Table.Body>
  );
};

const Tabler = (props) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  return (
    <Table.Root>
      <TableHead table={table} />
      <TableBody table={table} />
    </Table.Root>
  );
};

export default function App() {
  return (
    <ScrollArea className="flex-1">
      <Tabler />
      <ScrollBar orientation="horizontal" className="z-[5]" />
    </ScrollArea>
  );
}
