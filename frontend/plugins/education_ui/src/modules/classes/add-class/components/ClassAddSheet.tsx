import { IconPlus } from '@tabler/icons-react';

import {
  Button,
  Kbd,
  Sheet,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
} from 'erxes-ui';
import { useState } from 'react';
import { AddClassForm } from '@/classes/add-class/AddClassForm';
import { ClassHotKeyScope } from '@/classes/types/ClassHotKeyScope';

export const ClassAddSheet = () => {
  const setHotkeyScope = useSetHotkeyScope();
  const [open, setOpen] = useState<boolean>(false);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(ClassHotKeyScope.ClassAddSheet);
  };

  const onClose = () => {
    setOpen(false);
    setHotkeyScope('class-page');
  };

  useScopedHotkeys(`c`, () => onOpen(), 'class-page');
  useScopedHotkeys(`esc`, () => onClose(), ClassHotKeyScope.ClassAddSheet);

  return (
    <Sheet open={open} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add class
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddClassForm onOpenChange={setOpen} />
      </Sheet.View>
    </Sheet>
  );
};

export const ClassAddSheetHeader = () => {
  return (
    <Sheet.Header className="border-b gap-3">
      <Sheet.Title>Add class</Sheet.Title>
      <Sheet.Close />
    </Sheet.Header>
  );
};
