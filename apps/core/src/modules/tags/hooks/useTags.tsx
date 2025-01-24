import { OperationVariables, useQuery } from '@apollo/client';
import { tagsQuery } from '@/tags/graphql/queries/tagsQueries';
import { ITag } from '@/tags/types/tagTypes';

const TAGS_PER_PAGE = 30;

export const useTags = (options: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(tagsQuery, {
    errorPolicy: 'all',
    variables: {
      perPage: TAGS_PER_PAGE,
      ...options.variables,
    },
    ...options,
  });

  const { tags, tagsQueryCount: totalCount } = data || {};

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...options.variables,
        page: Math.ceil(tags.length / TAGS_PER_PAGE) + 1,
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

  const getTagByTagId = (tagId: string) => {
    return data?.tags.find((tag: ITag) => tag._id === tagId);
  };

  return {
    tags,
    totalCount,
    getTagByTagId,
    loading,
    error,
    handleFetchMore,
  };
};
