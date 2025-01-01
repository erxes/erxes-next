import { Cell } from '@tanstack/react-table';
import { Table } from 'erxes-ui/components';
import React, { useMemo } from 'react';
import { useRecordTable } from './RecordTableProvider';
import { RecordTableRow } from './RecordTableRow';
import { RecordTableRowSkeleton } from './RecordTableRowSkeleton';

export const RecordTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    renderCell: (cell: Cell<any, unknown>) => JSX.Element;
  }
>(({ renderCell, children, ...props }, ref) => {
  const { table } = useRecordTable();

  const tableContent = table.getRowModel().rows.map((row) => (
    <RecordTableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map(renderCell)}
    </RecordTableRow>
  ));

  const memoizedTableContent = useMemo(
    () => tableContent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.options.data, table.getState().columnOrder]
  );

  return (
    <Table.Body ref={ref} {...props}>
      {table.getState().columnSizingInfo.isResizingColumn
        ? memoizedTableContent
        : tableContent}
      {children}
    </Table.Body>
  );
});
