import { Cell } from '@tanstack/react-table';
import { Table } from '../table';
import React, { useMemo } from 'react';
import { useRecordTable } from './RecordTableProvider';

export const RecordTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    renderCell: (cell: Cell<any, unknown>) => JSX.Element;
  }
>(({ renderCell, ...props }, ref) => {
  const { table } = useRecordTable();

  const tableContent = table.getRowModel().rows.map((row) => (
    <Table.Row key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map(renderCell)}
    </Table.Row>
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
    </Table.Body>
  );
});
