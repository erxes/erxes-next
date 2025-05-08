import { cn, RecordTable, Table } from 'erxes-ui';

import { flexRender } from '@tanstack/react-table';
import React, { useMemo } from 'react';


export const AccountingTableRow = ({
  handleRowViewChange,
  Row,
}: {
  handleRowViewChange?: (id: string, inView: boolean) => void;
  Row?: React.ComponentType<React.HTMLAttributes<HTMLTableRowElement>>;
}) => {
  const { table } = RecordTable.useRecordTable();
  const RowComponent = Row || RecordTable.Row;
  const rows = table.getRowModel().rows;

  const tableContent = rows.map((row, rowIndex) => {
    const hasChangedPtrId = rows[rowIndex - 1]?.original?.ptrId !== row.original.ptrId;

    return (
      <>
        {hasChangedPtrId && (
          <RowComponent
            key={row.original.ptrId}
            id={row.original.ptrId}
            handleRowViewChange={(inView) =>
              handleRowViewChange?.(row.original._id, inView)
            }
          >
            <Table.Cell
              colSpan={row.getVisibleCells().length}
              className={cn(rowIndex === 0 && 'border-t')}
            >
              {'fsdafa'}
            </Table.Cell>
          </RowComponent>
        )}

        <RowComponent
          key={row.original._id}
          id={row.original._id}
          data-state={row.getIsSelected() && 'selected'}
          handleRowViewChange={(inView) =>
            handleRowViewChange?.(row.original._id, inView)
          }
        >
          {row.getVisibleCells().map((cell, cellIndex) => (
            <RecordTable.Cell
              cell={cell}
              key={cell.id}

            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </RecordTable.Cell>
          ))}
        </RowComponent>
      </>

    )
  });

  const memoizedTableContent = useMemo(
    () => tableContent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.options.data, table.getState().columnOrder],
  );
  return table.getState().columnSizingInfo.isResizingColumn
    ? memoizedTableContent
    : tableContent;
};
