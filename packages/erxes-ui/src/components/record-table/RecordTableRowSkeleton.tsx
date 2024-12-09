import React from 'react';
import { Skeleton } from '../skeleton';
import { Table } from '../table';
import { useRecordTable } from './RecordTableProvider';
import { useInView } from 'react-intersection-observer';

export const RecordTableRowSkeleton = ({
  rows = 1,
  handleReachedBottom,
}: {
  rows?: number;
  handleReachedBottom?: () => void;
}) => {
  // get column count
  const { table } = useRecordTable();
  const columnCount = table.getRowModel().rows[0]?.getVisibleCells().length;
  const { ref } = useInView({
    onChange: (inView) =>
      inView && handleReachedBottom && handleReachedBottom(),
  });

  return (
    <>
      <SkeletonRow ref={ref} columnCount={columnCount} />
      {Array.from({ length: rows - 1 }).map((_, index) => (
        <SkeletonRow key={index} columnCount={columnCount} />
      ))}
    </>
  );
};

const SkeletonRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { columnCount: number }
>(({ columnCount, ...props }, ref) => {
  return (
    <Table.Row ref={ref} className="h-8" {...props}>
      {Array.from({ length: columnCount }).map((_, index) => (
        <Table.Cell key={index} className="border-r-0 px-3">
          <Skeleton className="h-4 w-full" />
        </Table.Cell>
      ))}
    </Table.Row>
  );
});
