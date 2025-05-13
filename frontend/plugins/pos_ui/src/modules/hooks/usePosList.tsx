import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import queries from '../graphql/queries';

const POS_PER_PAGE = 30;

export const usePosList = (options = {}) => {
  const { data, loading, fetchMore } = useQuery(gql`${queries.posList}`, {
    variables: {
      perPage: POS_PER_PAGE,
      ...options
    },
  });

  const { posList, posListTotalCount } = data || {};

  const handleFetchMore = () => {
    if (posListTotalCount <= posList?.length) return;
    fetchMore({
      variables: {
        page: Math.ceil(posList.length / POS_PER_PAGE) + 1,
        perPage: POS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          posList: [...(prev.posList || []), ...fetchMoreResult.posList],
        });
      },
    });
  };

  return {
    loading,
    posList,
    totalCount: posListTotalCount,
    handleFetchMore,
  };
};