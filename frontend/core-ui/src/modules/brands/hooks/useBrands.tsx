import { useQuery, OperationVariables } from '@apollo/client';

import { BRANDS_QUERY } from '@/brands/graphql/queries/BrandsQuery';

import { IBrand } from '@/brands/types/brand';
export const useBrands = (options?: OperationVariables) => {
  const BRANDS_PER_PAGE = 10;
  const { data, loading, fetchMore, error } = useQuery(BRANDS_QUERY, {
    ...options,
    variables: {
      perPage: BRANDS_PER_PAGE,
      page: 1,
      ...options?.variables,
    },
  });

  const brands: IBrand[] = data?.brands || [];
  const totalCount = data?.brandsTotalCount;

  const handleFetchMore = () => {
    if (totalCount <= brands?.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((brands?.length || 1) / BRANDS_PER_PAGE) + 1,
        perPage: BRANDS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          brands: [...(prev.brands || []), ...fetchMoreResult.brands],
        });
      },
    });
  };
  return {
    brands,
    loading,
    error,
    handleFetchMore,
    totalCount,
  };
};
