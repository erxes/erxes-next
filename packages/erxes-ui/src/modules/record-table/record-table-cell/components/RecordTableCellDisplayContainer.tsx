import React from 'react';

export const RecordTableCellDisplayContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <div ref={ref} {...props} className="pl-2 w-full" />;
});
