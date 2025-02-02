import { OperationVariables, useQuery } from '@apollo/client';

import {
  TAG_BY_IDS_QUERY,
  tagsQuery,
} from '@/tags/graphql/queries/tagsQueries';

const TAGS_PER_PAGE = 30;

export const useTags = (options: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(tagsQuery, {
    variables: {
      perPage: TAGS_PER_PAGE,
      ...options.variables,
    },
    ...options,
  });

  const { tags, tagsQueryCount: totalCount } = data || {};

  const handleFetchMore = () => {
    if (totalCount <= tags?.length) return;
    fetchMore({
      variables: {
        ...options.variables,
        page: Math.ceil((tags?.length || 1) / TAGS_PER_PAGE) + 1,
        perPage: TAGS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          tags: [...(prev.tags || []), ...fetchMoreResult.tags],
        });
      },
    });
  };

  return {
    tags,
    totalCount,
    loading,
    error,
    handleFetchMore,
  };
};

export const useTagsByIds = (options: OperationVariables) => {
  const { data, loading, error } = useQuery(TAG_BY_IDS_QUERY, {
    variables: {
      ...options.variables,
    },
    ...options,
  });

  return {
    tags: data?.tags,
    loading,
    error,
  };
};
