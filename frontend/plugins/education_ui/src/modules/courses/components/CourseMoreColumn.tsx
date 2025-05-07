import { Cell } from '@tanstack/react-table';
import { RecordTable, usePreviousHotkeyScope } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { renderingCourseDetailAtom } from '~/modules/courses/states/courseDetailStates';
import { CourseHotKeyScope } from '@/courses/types/CourseHotKeyScope';

export const CourseMoreColumnCell = ({
  cell,
}: {
  cell: Cell<any, unknown>;
}) => {
  const [, setOpen] = useQueryState('courseId');
  const setRenderingContactDetail = useSetAtom(renderingCourseDetailAtom);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setTimeout(() => {
          setHotkeyScopeAndMemorizePreviousScope(
            CourseHotKeyScope.CourseEditSheet,
          );
        }, 100);
        setRenderingContactDetail(false);
      }}
    />
  );
};

export const courseMoreColumn = {
  id: 'more',
  cell: CourseMoreColumnCell,
  size: 33,
};
