import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { ICourse } from '@/courses/types/courseType';
import { ADD_COURSES } from '@/courses/graphql/mutations/addCourse';
import { GET_COURSES } from '@/courses/graphql/queries/getCourse';
import { useRecordTableCursor } from 'erxes-ui/modules';

interface CourseData {
  courses: {
    list: ICourse[];
    totalCount: number;
  };
}

interface AddCourseResult {
  courseAdd: ICourse;
}

export function useAddCourse(
  options?: MutationHookOptions<AddCourseResult, any>,
) {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'course_cursor',
  });
  const [courseAdd, { loading, error }] = useMutation<AddCourseResult>(
    ADD_COURSES,
    {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const queryVariables = { perPage: 30, cursor };
          const existingData = cache.readQuery<CourseData>({
            query: GET_COURSES,
            variables: queryVariables,
          });
          if (!existingData || !existingData.courses || !data?.courseAdd)
            return;

          cache.writeQuery<CourseData>({
            query: GET_COURSES,
            variables: queryVariables,
            data: {
              courses: {
                ...existingData.courses,
                list: [data.courseAdd, ...existingData.courses.list],
                totalCount: existingData.courses.totalCount + 1,
              },
            },
          });
        } catch (e) {
          console.error('error:', e);
        }
      },
    },
  );

  return { courseAdd, loading, error };
}
