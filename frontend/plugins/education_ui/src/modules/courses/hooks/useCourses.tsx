import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_COURSES } from '@/courses/graphql/queries/getCourse';

export const COURSES_PER_PAGE = 30;

export const useCourses = (options?: QueryHookOptions) => {
  const { data, loading, fetchMore } = useQuery(GET_COURSES, {
    ...options,
    variables: {
      perPage: COURSES_PER_PAGE,
    },
  });

  const { list: courses, totalCount } = data?.courses || {};

  const handleFetchMore = () =>
    totalCount > courses?.length &&
    fetchMore({
      variables: {
        page: Math.ceil(courses.length / COURSES_PER_PAGE) + 1,
        perPage: COURSES_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          courses: {
            ...prev.courses,
            list: [
              ...(prev.courses?.list || []),
              ...(fetchMoreResult.courses?.list || []),
            ],
          },
        });
      },
    });

  return {
    loading,
    courses,
    totalCount,
    handleFetchMore,
  };
};
