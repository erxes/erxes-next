import { ContactHotKeyScope } from '@/contacts/types/ContactHotKeyScope';
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
    setHotkeyScopeAndMemorizePreviousScope(ContactHotKeyScope.CustomerAddSheet);
  };

  const onClose = () => {
    setHotkeyScope(PageHotkeyScope.ContactsPage);
    onOpenChange?.(false);
  };

  useScopedHotkeys(`c`, () => onOpen(), PageHotkeyScope.ContactsPage);
  useScopedHotkeys(`esc`, () => onClose(), ContactHotKeyScope.CustomerAddSheet);

  return (
    <Sheet open={open} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add customer
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </Sheet.Content>
    </Sheet>
  );
};

export const CustomerAddSheetHeader = () => {
  return (
    <Sheet.Header className="p-5">
      <Sheet.Title>Add contact</Sheet.Title>
    </Sheet.Header>
  );
};
