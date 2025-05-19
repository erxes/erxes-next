import { OperationVariables, useQuery } from '@apollo/client';
import { GET_DEPARTMENTS_LIST } from '../graphql';

export const useDepartmentsList = (options?: OperationVariables) => {
  const { data, error, loading } = useQuery(GET_DEPARTMENTS_LIST, options);
  return {
    departments: data ? data?.departmentsMain?.list : [],
    totalCount: data ? data?.departmentsMain?.totalCount : 0,
    loading,
    error,
  };
};
