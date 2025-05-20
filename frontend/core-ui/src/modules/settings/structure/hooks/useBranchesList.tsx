import { type OperationVariables, useQuery } from '@apollo/client';
import { GET_BRANCHES_LIST } from '../graphql';

export const useBranchesList = (operationVariables?: OperationVariables) => {
  const { data, error, loading } = useQuery(
    GET_BRANCHES_LIST,
    operationVariables,
  );
  return {
    branches: data ? data?.branchesMain?.list : [],
    totalCount: data ? data?.branchesMain?.totalCount : 0,
    loading,
    error,
  };
};
