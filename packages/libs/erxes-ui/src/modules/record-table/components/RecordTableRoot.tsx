import React from 'react';

import { ScrollArea, Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

export const RecordTableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { scrollAreaClassName?: string }
>(({ scrollAreaClassName, ...props }, ref) => {
  return (
    <ScrollArea.Root
      scrollBarClassName="z-10"
      className={cn('h-full w-full', scrollAreaClassName)}
    >
      <Table.Root
        ref={ref}
        className="w-[--table-width] table-fixed border-spacing-0 text-[13px] bg-muted pb-3 pr-3"
        {...props}
      />
      <ScrollArea.Bar orientation="horizontal" className="z-10" />
    </ScrollArea.Root>
  );
});
