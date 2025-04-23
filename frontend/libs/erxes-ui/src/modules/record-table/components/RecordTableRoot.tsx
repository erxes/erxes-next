import React from 'react';

import { Table } from 'erxes-ui/components';

export const RecordTableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ ...props }, ref) => {
  return <Table ref={ref} className="w-[--table-width]" {...props} />;
});
