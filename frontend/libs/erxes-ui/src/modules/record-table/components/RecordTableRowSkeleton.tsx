import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Skeleton, Table } from 'erxes-ui/components';

import { useRecordTable } from './RecordTableProvider';

export const RecordTableRowSkeleton = ({
  rows = 1,
  handleInView,
}: {
  rows?: number;
  handleInView?: () => void;
}) => {
  // get column count
  const { table } = useRecordTable();
  const columnCount = table.getRowModel().rows[0]?.getVisibleCells().length;
  const { ref } = useInView({
    onChange: (inView) => {
      inView && handleInView && handleInView();
    },
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
        <Table.Cell key={index} className="border-r-0 px-2">
          <Skeleton className="h-4 w-full min-w-4" />
        </Table.Cell>
      ))}
    </Table.Row>
  );
});
