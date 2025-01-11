import { cn } from 'erxes-ui/lib';
import { forwardRef } from 'react';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const RecordTableCellContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isInEditMode } = useRecordTableCellContext();

  return (
    <div
      ref={ref}
      className={cn(
        'w-full flex items-center relative h-8 cursor-pointer box-border overflow-hidden',
        isInEditMode && 'overflow-auto items-start',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
