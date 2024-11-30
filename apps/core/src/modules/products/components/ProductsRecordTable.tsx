import { ColumnDef, flexRender } from '@tanstack/react-table';
import { Checkbox, RecordTable } from 'erxes-ui';
import { Product, makeData } from './makeData';
import { format } from 'date-fns';
import React from 'react';
import {
  CaseSensitive,
  ChartNoAxesGantt,
  CircleCheck,
  DollarSign,
  HistoryIcon,
  LetterText,
} from 'lucide-react';

const defaultColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'checkbox',
    id: 'checkbox',
    header: () => (
      <div className="flex items-center justify-center">
        <Checkbox />
      </div>
    ),
    size: 40,
    cell: (info) => (
      <div className="flex items-center justify-center">
        <Checkbox />
      </div>
    ),
  },
  {
    accessorKey: 'title',
    id: 'title',
    header: () => (
      <div className="flex items-center gap-1">
        <LetterText className="w-4 h-4" strokeWidth={2.5} />
        Title
      </div>
    ),
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 280,
  },
  {
    accessorKey: 'price',
    id: 'price',
    header: () => (
      <div className="flex items-center gap-1">
        <DollarSign className="w-4 h-4" strokeWidth={2.5} />
        Price
      </div>
    ),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: () => (
      <div className="flex items-center gap-1">
        <ChartNoAxesGantt className="w-4 h-4" strokeWidth={2.5} />
        Category
      </div>
    ),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: () => (
      <div className="flex items-center gap-1">
        <CircleCheck className="w-4 h-4" strokeWidth={2.5} />
        Status
      </div>
    ),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: (info) => (
      <div className="flex items-center gap-1">
        <HistoryIcon className="w-4 h-4" strokeWidth={2.5} />
        Created At
      </div>
    ),
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

export const ProductsRecordTable = () => {
  const [data] = React.useState(() => makeData(300));
  return (
    <RecordTable.Provider
      columns={defaultColumns}
      data={data}
      className="flex-grow-0 basis-full overflow-hidden"
    >
      <RecordTable.ScrollArea className="h-full">
        <RecordTable.Root>
          <RecordTable.Header
            renderHead={(header) => (
              <RecordTable.Head header={header}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </RecordTable.Head>
            )}
          />
          <RecordTable.Body
            renderCell={(cell) => (
              <RecordTable.Cell cell={cell}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </RecordTable.Cell>
            )}
          />
        </RecordTable.Root>
      </RecordTable.ScrollArea>
    </RecordTable.Provider>
  );
};
