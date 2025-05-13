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
import { AddCourseCategoryForm } from '@/courses/add-category/AddCourseCategoryForm';

export const CourseCategoryAddDialog = () => {
  const setHotkeyScope = useSetHotkeyScope();
  const [open, setOpen] = useState<boolean>(false);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope('course-category-add-sheet');
  };

  const onClose = () => {
    setOpen(false);
    setHotkeyScope('course-category-page');
  };

  useScopedHotkeys(`c`, () => onOpen(), 'course-category-page');
  useScopedHotkeys(`esc`, () => onClose(), 'course-category-add-sheet');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add category
          <Kbd>C</Kbd>
        </Button>
      </Dialog.Trigger>
      <Dialog.ContentCombined
        title="Add course category"
        description="Add a new course category"
        className="sm:max-w-2xl"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddCourseCategoryForm onOpenChange={setOpen} />
      </Dialog.ContentCombined>
    </Dialog>
  );
};
