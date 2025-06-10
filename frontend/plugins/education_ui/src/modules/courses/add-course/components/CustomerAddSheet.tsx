import { IconPlus } from '@tabler/icons-react';

import {
  Button,
  Kbd,
  Sheet,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
} from 'erxes-ui';
import { CourseHotKeyScope } from '@/courses/types/CourseHotKeyScope';
import { useState } from 'react';
import { AddCourseForm } from '../AddCourseForm';

export const CourseAddSheet = () => {
  const setHotkeyScope = useSetHotkeyScope();
  const [open, setOpen] = useState<boolean>(false);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(CourseHotKeyScope.CourseAddSheet);
  };

  const onClose = () => {
    setOpen(false);
    setHotkeyScope('course-page');
  };

  useScopedHotkeys(`c`, () => onOpen(), 'course-page');
  useScopedHotkeys(`esc`, () => onClose(), CourseHotKeyScope.CourseAddSheet);

  return (
    <Sheet open={open} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add course
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddCourseForm onOpenChange={setOpen} />
      </Sheet.View>
    </Sheet>
  );
};

export const CourseAddSheetHeader = () => {
  return (
    <Sheet.Header className="border-b gap-3">
      <Sheet.Title>Add course</Sheet.Title>
      <Sheet.Close />
    </Sheet.Header>
  );
};
