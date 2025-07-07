import { OperationVariables, useQuery } from '@apollo/client';
import { contractTypeQueries } from '~/modules/contractTypes/graphql/queries';

export const useContractTypes = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(
    contractTypeQueries.contractTypes,
    options,
  );

  const { savingsContractTypes } = data || {};

  return {
    contractTypes: savingsContractTypes?.list || [],
    loading,
    error,
  };
};
