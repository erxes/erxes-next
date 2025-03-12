import {
  IconArrowMerge,
  IconLayoutSidebarLeftCollapse,
} from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui/components';
import { ReactNode } from 'react';
import { MergeToolTip } from './MergeToolTip';
import { cn } from 'erxes-ui/lib';
export const MergeSheet = ({
  children,
  disabled,
  className,
}: {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <Sheet>
      <MergeToolTip>
        <Sheet.Trigger asChild>
          <Button variant={'secondary'} disabled={disabled}>
            <IconArrowMerge />
            Merge
          </Button>
        </Sheet.Trigger>
      </MergeToolTip>
      <Sheet.Content className="sm:max-w-screen-lg p-0 flex gap-0 flex-col">
        <MergeSheetHeader />
        <div className={cn('w-full h-full', className)}>{children}</div>
      </Sheet.Content>
    </Sheet>
  );
};

const MergeSheetHeader = () => (
  <Sheet.Header className="border-b p-3 m-0 flex-row items-center space-y-0 gap-3">
    <Button variant="ghost" size="icon">
      <IconLayoutSidebarLeftCollapse />
    </Button>
    <Sheet.Title>Merge Customers</Sheet.Title>
    <Sheet.Close />
  </Sheet.Header>
);
