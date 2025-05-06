import { CustomerHotKeyScope } from '@/contacts/types/CustomerHotKeyScope';
import { IconPlus } from '@tabler/icons-react';

import {
  Button,
  Kbd,
  Sheet,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
} from 'erxes-ui';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { useState } from 'react';
import { AddCustomerForm } from './AddCustomerForm';

export const CustomerAddSheet = () => {
  const setHotkeyScope = useSetHotkeyScope();
  const [open, setOpen] = useState<boolean>(false);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();
  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(
      CustomerHotKeyScope.CustomerAddSheet,
    );
  };

  const onClose = () => {
    setHotkeyScope(PageHotkeyScope.CustomersPage);
    setOpen(false);
  };

  useScopedHotkeys(`c`, () => onOpen(), PageHotkeyScope.CustomersPage);
  useScopedHotkeys(
    `esc`,
    () => onClose(),
    CustomerHotKeyScope.CustomerAddSheet,
  );

  return (
    <Sheet open={open} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add customer
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddCustomerForm onOpenChange={setOpen} />
      </Sheet.View>
    </Sheet>
  );
};

export const CustomerAddSheetHeader = () => {
  return (
    <Sheet.Header className="p-5">
      <Sheet.Title>Add contact</Sheet.Title>
      <Sheet.Close />
    </Sheet.Header>
  );
};
