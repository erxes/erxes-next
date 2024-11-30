import * as React from 'react';
import { ScrollArea } from '../scroll-area';

export const RecordTableScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollArea.Root>
>(({ children, ...props }, ref) => {
  return (
    <ScrollArea.Root ref={ref} {...props} scrollBarClassName="z-10">
      {children}
      <ScrollArea.Bar orientation="horizontal" className="z-10" />
    </ScrollArea.Root>
  );
});
