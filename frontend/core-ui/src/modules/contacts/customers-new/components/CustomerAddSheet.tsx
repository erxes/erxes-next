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
interface CustomerAddSheetProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}
export const CustomerAddSheet = ({
  children,
  open,
  onOpenChange,
}: CustomerAddSheetProps) => {
  const setHotkeyScope = useSetHotkeyScope();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    onOpenChange?.(true);
    setHotkeyScopeAndMemorizePreviousScope(
      CustomerHotKeyScope.CustomerAddSheet,
    );
  };

  const onClose = () => {
    setHotkeyScope(PageHotkeyScope.CustomersPage);
    onOpenChange?.(false);
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
        {children}
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
