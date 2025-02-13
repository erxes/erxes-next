import { ContactHotKeyScope } from '@/contacts/types/ContactHotKeyScope';
import { IconPlus } from '@tabler/icons-react';

import { Button, Sheet } from 'erxes-ui/components';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';
import { useScopedHotkeys } from 'erxes-ui/modules/hotkey/hooks/useScopedHotkeys';
import { currentHotkeyScopeState } from 'erxes-ui/modules/hotkey/states/internal/currentHotkeyScopeState';
import { useAtomValue } from 'jotai';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { useSetHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/useSetHotkeyScope';
import { Kbd } from 'erxes-ui/components/kbd';
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
  const currentHotkeyScope = useAtomValue(currentHotkeyScopeState);
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
          if (
            currentHotkeyScope.scope === ContactHotKeyScope.CustomerAddSheet
          ) {
            onClose();
          }
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
