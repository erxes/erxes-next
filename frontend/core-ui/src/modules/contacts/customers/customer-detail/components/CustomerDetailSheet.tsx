import { Button, Sheet, cn, useQueryState } from 'erxes-ui';

import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { customerDetailActiveActionTabAtom } from '@/contacts/states/customerDetailStates';
import { useAtomValue } from 'jotai';
import { usePreviousHotkeyScope } from 'erxes-ui';

export const CustomerDetailSheet = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof Sheet>) => {
  const [open, setOpen] = useQueryState<string>('contactId');
  const { goBackToPreviousHotkeyScope } = usePreviousHotkeyScope();

  const activeTab = useAtomValue(customerDetailActiveActionTabAtom);

  return (
    <Sheet
      open={!!open}
      onOpenChange={() => {
        setOpen(null);
        goBackToPreviousHotkeyScope();
      }}
      {...props}
    >
      <Sheet.View
        className={cn(
          'p-0 md:w-[calc(100vw-theme(spacing.4))] flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none sm:max-w-screen-2xl',
          !!activeTab && 'md:w-[calc(100vw-theme(spacing.4))]',
          className,
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button variant="ghost" size="icon">
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Customer Detail</Sheet.Title>
          <Sheet.Close />
          <Sheet.Description className="sr-only">
            Customer Detail
          </Sheet.Description>
        </Sheet.Header>
        {children}
      </Sheet.View>
    </Sheet>
  );
};
