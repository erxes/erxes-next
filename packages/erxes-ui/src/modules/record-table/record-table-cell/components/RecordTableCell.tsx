import React from 'react';
import { Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
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
        'bg-background whitespace-nowrap h-8 border-r group-data-[state=selected]/table-row:bg-muted group-hover/table-row:bg-muted p-0 transition-colors',
        column.getIsPinned() === 'left' && 'sticky z-[1]',
        column.getIsPinned() === 'right' && 'sticky z-[1]',
        className
      )}
      style={{
        width: `calc(var(--col-${column.id}-size) * 1px)`,
        left:
          column.getIsPinned() === 'left'
            ? `${column.getStart('left')}px`
            : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </Table.Cell>
  );
});
