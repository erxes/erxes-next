import { cn } from 'erxes-ui/lib';
import { RecordTableCell } from '../record-table-cell/components/RecordTableCell';
import { useRecordTable } from './RecordTableProvider';
import { RecordTableRow } from './RecordTableRow';
import { flexRender } from '@tanstack/react-table';
import { useMemo } from 'react';

export const RecordTableRowList = ({
  handleRowViewChange,
}: {
  handleRowViewChange?: (id: string, inView: boolean) => void;
}) => {
  const { table } = useRecordTable();

  const tableContent = table.getRowModel().rows.map((row, rowIndex) => (
    <RecordTableRow
      key={row.original._id}
      data-state={row.getIsSelected() && 'selected'}
      handleRowViewChange={(inView) =>
        handleRowViewChange?.(row.original._id, inView)
      }
    >
      {row.getVisibleCells().map((cell, cellIndex) => (
        <RecordTableCell
          cell={cell}
          key={cell.id}
          className={cn(rowIndex === 0 && 'border-t')}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </RecordTableCell>
      ))}
    </RecordTableRow>
  ));

  const memoizedTableContent = useMemo(
    () => tableContent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.options.data, table.getState().columnOrder],
  );
  return table.getState().columnSizingInfo.isResizingColumn
    ? memoizedTableContent
    : tableContent;
};
