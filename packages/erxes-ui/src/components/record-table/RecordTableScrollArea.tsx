import * as React from 'react';
import { ScrollArea } from '../scroll-area';

export const RecordTableScrollArea = ({ children, ...props }) => {
  const scrollRef =
    React.useRef<React.ElementRef<typeof ScrollArea.Root>>(null);
  return (
    <ScrollArea.Root ref={scrollRef} {...props} scrollBarClassName="z-10">
      {children}
      <ScrollArea.Bar orientation="horizontal" className="z-10" />
    </ScrollArea.Root>
  );
};
