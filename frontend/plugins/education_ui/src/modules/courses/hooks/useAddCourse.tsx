import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { ICourse } from '@/courses/types/courseType';
import { ADD_COURSES } from '@/courses/graphql/mutations/addCourse';
import { GET_COURSES } from '@/courses/graphql/queries/getCourses';

interface CourseData {
  course: {
    list: ICourse[];
    totalCount: number;
  };
}

interface AddCourseResult {
  coursesAdd: ICourse;
}

export function useAddCourse(
  options?: MutationHookOptions<AddCourseResult, any>,
) {
  const [courseAdd, { loading, error }] = useMutation<AddCourseResult>(
    ADD_COURSES,
    {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const queryVariables = { perPage: 30, dateFilters: null };
          const existingData = cache.readQuery<CourseData>({
            query: GET_COURSES,
            variables: queryVariables,
          });
          if (!existingData || !existingData.course || !data?.coursesAdd)
            return;

          cache.writeQuery<CourseData>({
            query: GET_COURSES,
            variables: queryVariables,
            data: {
              course: {
                ...existingData.course,
                list: [data.coursesAdd, ...existingData.course.list],
                totalCount: existingData.course.totalCount + 1,
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
