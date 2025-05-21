import { OperationVariables, useQuery } from '@apollo/client';
import { GET_BRANDS } from '../graphql';

export const useBrands = (options?: OperationVariables) => {
  const { data, error, loading } = useQuery(GET_BRANDS, options);

  return {
    brands: data?.brands?.list || [],
    totalCount: data?.brands?.totalCount || 0,
    pageInfo: data?.brands?.pageInfo || undefined,
    error,
    loading,
  };
};
