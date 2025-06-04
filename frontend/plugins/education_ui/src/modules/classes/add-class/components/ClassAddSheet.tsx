import { IconPlus } from '@tabler/icons-react';

import {
  Button,
  Dialog,
  Kbd,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add class
          <Kbd>C</Kbd>
        </Button>
      </Dialog.Trigger>
      <Dialog.ContentCombined
        title="Add class"
        description="Add a new class"
        className="sm:max-w-2xl"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddClassForm onOpenChange={setOpen} />
      </Dialog.ContentCombined>
    </Dialog>
  );
};
