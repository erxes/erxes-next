import React from 'react';

import { ScrollArea, Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

export const RecordTableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { scrollAreaClassName?: string }
>(({ scrollAreaClassName, ...props }, ref) => {
  return (
    <ScrollArea
      scrollBarClassName="z-10"
      className={cn('h-full w-full pb-3 pr-3', scrollAreaClassName)}
    >
      <Table ref={ref} className="w-[--table-width]" {...props} />
      <ScrollArea.Bar orientation="horizontal" className="z-10" />
    </ScrollArea>
  );
});
