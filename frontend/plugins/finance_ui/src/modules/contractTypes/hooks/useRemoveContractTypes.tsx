import { OperationVariables, useMutation } from '@apollo/client';
import { contractTypesMutations } from '~/modules/contractTypes/graphql/mutation';
import { contractTypeQueries } from '~/modules/contractTypes/graphql/queries';
import { IContractType } from '~/modules/contractTypes/types';

export const useRemoveContractTypes = () => {
  const [_removeContractType, { loading }] = useMutation(
    contractTypesMutations.contractTypesRemove,
  );

  const removeContractType = async (
    contractTypeIds: string | string[],
    options?: OperationVariables,
  ) => {
    if (typeof contractTypeIds === 'string') {
      contractTypeIds = (contractTypeIds || '').split(',');
    }

    await _removeContractType({
      ...options,
      variables: {
        contractTypeIds,
        ...options?.variables,
      },
      update: (cache) => {
        cache.updateQuery(
          {
            query: contractTypeQueries.contractTypes,
            variables: { dateFilters: null },
          },
          ({ savingsContractTypes }) => ({
            savingsContractTypes: {
              ...savingsContractTypes,
              list: savingsContractTypes.list.filter(
                (type: IContractType) => !contractTypeIds.includes(type._id),
              ),
              totalCount: Math.max(
                0,
                savingsContractTypes.totalCount - contractTypeIds.length,
              ),
            },
          }),
        );
      },
    });
  };
  return { removeContractType, loading };
};
