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
      className={cn('h-full w-full', scrollAreaClassName)}
    >
      <Table.Root
        ref={ref}
        className="w-[--table-width] table-fixed border-spacing-0 text-[13px] pb-3 pr-3"
        {...props}
      />
      <ScrollArea.Bar orientation="horizontal" className="z-10" />
    </ScrollArea>
  );
});
