import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';

export const RecordTableInlineCellEdit = ({
  children,
}: React.PropsWithChildren) => {
  const { isInEditMode, onCloseEditMode } = useRecordTableCellContext();
  console.log(isInEditMode);

  return (
    <Popover open={isInEditMode} modal onOpenChange={onCloseEditMode}>
      <PopoverTrigger className="w-full" />
      <PopoverContent
        className="min-w-[var(--radix-popper-anchor-width)] p-0 z-20 bg-background shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        sideOffset={-1}
        align="start"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
