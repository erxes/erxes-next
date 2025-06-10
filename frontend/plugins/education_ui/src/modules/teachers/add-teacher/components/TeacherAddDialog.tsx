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
import { TeacherHotKeyScope } from '@/teachers/types/TeacherHotKeyScope';
import { AddTeacherForm } from '@/teachers/add-teacher/AddTeacherForm';

export const TeacherAddDialog = () => {
  const setHotkeyScope = useSetHotkeyScope();
  const [open, setOpen] = useState<boolean>(false);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(TeacherHotKeyScope.TeacherAddSheet);
  };

  const onClose = () => {
    setOpen(false);
    setHotkeyScope('teacher-page');
  };

  useScopedHotkeys(`c`, () => onOpen(), 'teacher-page');
  useScopedHotkeys(`esc`, () => onClose(), TeacherHotKeyScope.TeacherAddSheet);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add teacher
          <Kbd>C</Kbd>
        </Button>
      </Dialog.Trigger>
      <Dialog.ContentCombined
        title="Add teacher"
        description="Add a new teacher"
        className="sm:max-w-2xl"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddTeacherForm onOpenChange={setOpen} />
      </Dialog.ContentCombined>
    </Dialog>
  );
};
