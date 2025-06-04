import { QueryHookOptions, useQuery } from '@apollo/client';

import { ICourseCategory } from '@/courses/types/courseType';
import { GET_COURSE_CATEGORY } from '@/courses/graphql/queries/getCourseCategory';

export const useCourseCategories = (options?: QueryHookOptions) => {
  const { data, loading } = useQuery<{
    courseCategories: ICourseCategory[];
  }>(GET_COURSE_CATEGORY, options);

  return {
    courseCategories: data?.courseCategories,
    loading,
  };
};
