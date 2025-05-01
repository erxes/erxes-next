import { OperationVariables, useQuery } from '@apollo/client';

import { TAG_BADGE_QUERY, TAGS_QUERY } from '../graphql/queries/tagsQueries';
import { ITag } from 'ui-modules/modules';
import { IPageInfo } from 'ui-modules/modules';

const TAGS_PER_PAGE = 20;

export const useTags = (options: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery<{
    tags: {
      list: ITag[];
      totalCount: number;
      pageInfo: IPageInfo;
    };
  }>(TAGS_QUERY, {
    ...options,
  });
  const { list: tags, totalCount = 0, pageInfo } = data?.tags || {};

  const handleFetchMore = () => {
    if (totalCount <= (tags?.length || 0)) return;
    fetchMore({
      variables: {
        ...options.variables,
        cursor: pageInfo?.endCursor,
        limit: TAGS_PER_PAGE,
        direction: 'forward',
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          tags: {
            list: [...(prev.tags?.list || []), ...fetchMoreResult.tags.list],
            totalCount: fetchMoreResult.tags.totalCount,
            pageInfo: fetchMoreResult.tags.pageInfo,
          },
        });
      },
    });
  };

  return {
    tags:
      (tags?.length || 0) > 1
        ? [...(tags || [])].sort((a, b) => a.order.localeCompare(b.order))
        : tags,
    totalCount,
    loading,
    error,
    handleFetchMore,
  };
};

export const useTagsByIds = (options: OperationVariables) => {
  const { data, loading, error } = useQuery<{
    tagDetail: ITag;
  }>(TAG_BADGE_QUERY, {
    ...options,
  });

  const { tagDetail } = data || {};

  return {
    tagDetail,
    loading,
    error,
  };
};
