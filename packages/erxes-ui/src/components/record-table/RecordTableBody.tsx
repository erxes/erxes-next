import { Cell } from '@tanstack/react-table';
import { Table } from '../table';
import React from 'react';
import { useRecordTable } from './RecordTableProvider';

export const RecordTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    renderCell: (cell: Cell<any, unknown>) => JSX.Element;
  }
>(({ renderCell, ...props }, ref) => {
  const { table } = useRecordTable();
  return (
    <Table.Body ref={ref} {...props}>
      {table.getRowModel().rows.map((row) => (
        <Table.Row key={row.id}>
          {row.getVisibleCells().map(renderCell)}
        </Table.Row>
      ))}
    </Table.Body>
  );
});
