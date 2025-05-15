import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import {
  Button,
  cn,
  Sheet,
  usePreviousHotkeyScope,
  useQueryState,
} from 'erxes-ui';
import { useCourseDetail } from '../hooks/useCourseDetail';

export const CourseDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useQueryState<string>('courseId');
  const { goBackToPreviousHotkeyScope } = usePreviousHotkeyScope();

  const { courseDetail } = useCourseDetail();

  const { name } = courseDetail || {};

  return (
    <Sheet
      open={!!open}
      onOpenChange={() => {
        setOpen(null);
        goBackToPreviousHotkeyScope();
      }}
    >
      <Sheet.View
        className={cn(
          'p-0 md:max-w-screen-2xl flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none',
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button variant="ghost" size="icon">
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>{name}</Sheet.Title>
          <Sheet.Close />
          <Sheet.Description className="sr-only">
            Course Detail
          </Sheet.Description>
        </Sheet.Header>
        {children}
      </Sheet.View>
    </Sheet>
  );
};
