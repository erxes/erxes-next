import React from 'react';
import { Table } from '../table';

export const RecordTableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>((props, ref) => {
  return (
    <Table.Root
      ref={ref}
      className="w-[--table-width] table-fixed border-spacing-0 text-[13px]"
      {...props}
    />
  );
});
