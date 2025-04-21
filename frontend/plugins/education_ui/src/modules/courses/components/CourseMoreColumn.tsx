import { Cell } from '@tanstack/react-table';
import { RecordTable } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { renderingCourseDetailAtom } from '@/courses/detail/states/courseDetailStates';

export const CourseMoreColumnCell = ({
  cell,
}: {
  cell: Cell<any, unknown>;
}) => {
  const [, setOpen] = useQueryState('course_id');
  const setRenderingContactDetail = useSetAtom(renderingCourseDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
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
