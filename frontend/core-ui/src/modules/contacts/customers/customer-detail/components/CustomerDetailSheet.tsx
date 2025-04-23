import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';

import { Button, Sheet, useQueryState, useSetHotkeyScope, cn } from 'erxes-ui';

import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { contactDetailActiveActionTabAtom } from '@/contacts/states/contactDetailStates';
import { CustomerHotKeyScope } from '@/contacts/types/CustomerHotKeyScope';

export const CustomerDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useQueryState<string>('contact_id');
  const setHotkeyScope = useSetHotkeyScope();

  const activeTab = useAtomValue(contactDetailActiveActionTabAtom);

  useEffect(() => {
    if (open) {
      setHotkeyScope(CustomerHotKeyScope.CustomerEditSheet);
    }
  }, [open]);

  return (
    <Sheet
      open={!!open}
      onOpenChange={() => {
        setOpen(null);
        setHotkeyScope(PageHotkeyScope.ContactsPage);
      }}
    >
      <Sheet.Content
        className={cn(
          'p-0 md:max-w-screen-2xl flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none',
          !!activeTab && 'md:w-[calc(100vw-theme(spacing.4))]',
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
      </Sheet.Content>
    </Sheet>
  );
};
