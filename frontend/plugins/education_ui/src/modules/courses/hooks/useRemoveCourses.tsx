import { OperationVariables, useMutation } from '@apollo/client';
import { REMOVE_COURSES } from '@/courses/graphql/mutations/removeCourses';
import { GET_COURSES } from '@/courses/graphql/queries/getCourse';
import { ICourse } from '@/courses/types/courseType';
import { useRecordTableCursor } from 'erxes-ui/modules';

export const useRemoveCourses = () => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'course_cursor',
  });
  const [_removeCourses, { loading }] = useMutation(REMOVE_COURSES);

  const removeCourses = async (
    courseIds: string[],
    options?: OperationVariables,
  ) => {
    await _removeCourses({
      ...options,
      variables: { courseIds, ...options?.variables },
      update: (cache) => {
        try {
          cache.updateQuery(
            {
              query: GET_COURSES,
              variables: { perPage: 30, cursor },
            },
            ({ courses }) => ({
              courses: {
                ...courses,
                list: courses.list.filter(
                  (courses: ICourse) => !courseIds.includes(courses._id),
                ),
                totalCount: courses.totalCount - courseIds.length,
              },
            }),
          );
        } catch (e) {
          console.log(e);
        }
      },
    });
  };

  return { removeCourses, loading };
};
