import { OperationVariables, useQuery } from '@apollo/client';
import { IUnitsMain } from '../types/Unit';
import { GET_UNITS_MAIN } from '../graphql/queries/getUnits';

const UNITS_PER_PAGE = 30;

export const useUnits = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    unitsMain: IUnitsMain;
  }>(GET_UNITS_MAIN, options);

  const units = data?.unitsMain.list || [];
  const totalCount = data?.unitsMain.totalCount || 0;

  const handleFetchMore = () => {
    if (totalCount <= units?.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((units?.length || 1) / UNITS_PER_PAGE) + 1,
        perPage: UNITS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          unitsMain: {
            ...fetchMoreResult.unitsMain,
            list: [
              ...(prev.unitsMain.list || []),
              ...fetchMoreResult.unitsMain.list,
            ],
          },
        });
      },
    });
  };

  return {
    units,
    loading,
    error,
    handleFetchMore,
  };
};
