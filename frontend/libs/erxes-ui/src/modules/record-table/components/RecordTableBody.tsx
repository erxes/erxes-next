import React, { useMemo } from 'react';

import { flexRender } from '@tanstack/react-table';

import { Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

import { useRecordTable } from './RecordTableProvider';
import { RecordTableRow } from './RecordTableRow';
import { RecordTableCell } from '../record-table-cell/components/RecordTableCell';

export const RecordTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  const { table } = useRecordTable();

  const tableContent = table.getRowModel().rows.map((row, rowIndex) => (
    <RecordTableRow key={row.original._id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell, cellIndex) => (
        <RecordTableCell
          cell={cell}
          key={cell.id}
          className={cn(
            rowIndex === 0 && cellIndex === 0 && 'rounded-tl-lg',
            rowIndex === 0 &&
              cellIndex === row.getVisibleCells().length - 1 &&
              'rounded-tr-lg',
            rowIndex === 0 && 'border-t'
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </RecordTableCell>
      ))}
    </RecordTableRow>
  ));

  const memoizedTableContent = useMemo(
    () => tableContent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.options.data, table.getState().columnOrder]
  );

  return (
    <Table.Body
      ref={ref}
      className={cn(
        'border border-collapse rounded-2xl overflow-hidden',
        className
      )}
      {...props}
    >
      {table.getState().columnSizingInfo.isResizingColumn
        ? memoizedTableContent
        : tableContent}
      {children}
    </Table.Body>
  );
});
