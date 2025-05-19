import { useInView } from 'react-intersection-observer';

import { Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

import React from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useRecordTable } from './RecordTableProvider';

export const RecordTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    handleRowViewChange?: (inView: boolean) => void;
    id?: string;
  }
>(({ children, className, handleRowViewChange, id, ...props }, ref) => {
  const { table } = useRecordTable();
  const { ref: inViewRef, inView } = useInView({
    onChange: handleRowViewChange,
  });

  return (
    <Table.Row
      {...props}
      ref={mergeRefs([ref, inViewRef])}
      className={cn('h-cell', inView ? 'in-view' : 'out-of-view', className)}
      id={id}
    >
      {table.getRowModel().rows.length > 200 && !inView ? (
        <td
          className="h-cell bg-background"
          colSpan={table.getAllColumns().length}
        />
      ) : (
        children
      )}
    </Table.Row>
  );
});

RecordTableRow.displayName = 'RecordTableRow';
