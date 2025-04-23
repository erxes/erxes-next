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

interface CustomerAddSheetProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}
export const CourseAddSheet = ({
  children,
  open,
  onOpenChange,
}: CustomerAddSheetProps) => {
  const setHotkeyScope = useSetHotkeyScope();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    onOpenChange?.(true);
    setHotkeyScopeAndMemorizePreviousScope(CourseHotKeyScope.CourseAddSheet);
  };

  const onClose = () => {
    setHotkeyScope('course-page');
    onOpenChange?.(false);
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

export const CourseAddSheetHeader = () => {
  return (
    <Sheet.Header className="p-5">
      <Sheet.Title>Add course</Sheet.Title>
      <Sheet.Description>Create and configure your courses</Sheet.Description>
    </Sheet.Header>
  );
};
