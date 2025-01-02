import { forwardRef, ReactNode } from 'react';

interface RecordTableCellContainerProps {
  children: ReactNode;
}

export const RecordTableCellContainer = forwardRef<
  HTMLDivElement,
  RecordTableCellContainerProps
>(({ children }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full flex items-center relative h-8 cursor-pointer box-border overflow-hidden"
    >
      {children}
    </div>
  );
});
