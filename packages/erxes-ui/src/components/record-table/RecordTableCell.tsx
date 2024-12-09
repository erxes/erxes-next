import React from 'react';
import { Table } from '../table';
import { cn } from '../../lib/utils';
import { Cell } from '@tanstack/react-table';

export const RecordTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement> & { cell: Cell<any, unknown> }
>(({ children, className, cell, style, ...props }, ref) => {
  const { column } = cell;
  return (
    <Table.Cell
      ref={ref}
      className={cn(
        'bg-background whitespace-nowrap h-8 border-r overflow-hidden [&:has([role=checkbox])]:border-r-0 group-data-[state=selected]/table-row:bg-muted p-0',
        column.getIsPinned() === 'left'
          ? 'sticky left-10 [&:has([role=checkbox])]:left-0 z-[1]'
          : null,
        column.getIsPinned() === 'right' ? 'sticky right-0 z-[1]' : null,
        className
      )}
      style={{
        width: `calc(var(--col-${column.id}-size) * 1px)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Table.Cell>
  );
});
