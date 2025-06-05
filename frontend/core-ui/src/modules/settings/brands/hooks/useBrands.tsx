import { OperationVariables, useQuery } from '@apollo/client';
import { GET_BRANDS } from '../graphql';
import { useMultiQueryState } from 'erxes-ui';

export const useBrands = (options?: OperationVariables) => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
  }>(['searchValue']);
  const { data, error, loading, fetchMore } = useQuery(GET_BRANDS, {
    variables: {
      ...options?.variables,
      searchValue: queries?.searchValue,
    },
    ...options,
  });
  const brands = data?.brands?.list || [];
  const totalCount = data?.brands?.totalCount || 0;
  const pageInfo = data?.brands?.pageInfo || undefined;

  return {
    brands,
    totalCount,
    pageInfo,
    error,
    loading,
  };
};
