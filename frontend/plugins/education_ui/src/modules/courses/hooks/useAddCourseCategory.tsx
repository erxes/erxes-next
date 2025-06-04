import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { ICourseCategory } from '@/courses/types/courseType';
import { ADD_COURSE_CATEGORY } from '@/courses/graphql/mutations/addCourseCategory';
import { GET_COURSE_CATEGORY } from '@/courses/graphql/queries/getCourseCategory';

interface CourseCategoryData {
  courseCategories: ICourseCategory[];
}

interface AddCourseCategoryResult {
  courseCategoryAdd: ICourseCategory;
}

export function useAddCourseCategory(
  options?: MutationHookOptions<AddCourseCategoryResult, any>,
) {
  const [courseCategoryAdd, { loading, error }] =
    useMutation<AddCourseCategoryResult>(ADD_COURSE_CATEGORY, {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const existingData = cache.readQuery<CourseCategoryData>({
            query: GET_COURSE_CATEGORY,
          });
          if (!existingData || !data?.courseCategoryAdd) return;

          cache.writeQuery<CourseCategoryData>({
            query: GET_COURSE_CATEGORY,
            data: {
              courseCategories: [
                data.courseCategoryAdd,
                ...existingData.courseCategories,
              ],
            },
          });
        } catch (e) {
          console.error('error:', e);
        }
      },
    });

  return { courseCategoryAdd, loading, error };
}
