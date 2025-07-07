import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import { contractTypesMutations } from '~/modules/contractTypes/graphql/mutation';
import { contractTypeQueries } from '~/modules/contractTypes/graphql/queries';
import {
  AddConrtactTypeVariables,
  AddContractTypeResult,
  ContractTypeData,
} from '~/modules/contractTypes/types';

export const useAddContractType = (
  options?: MutationHookOptions<
    AddContractTypeResult,
    AddConrtactTypeVariables
  >,
) => {
  const [contractTypesAdd, { loading, error }] = useMutation<
    AddContractTypeResult,
    AddConrtactTypeVariables
  >(contractTypesMutations.contractTypesAdd, {
    ...options,
    update: (cache: ApolloCache<AddConrtactTypeVariables>, { data }) => {
      const existingData = cache.readQuery<ContractTypeData>({
        query: contractTypeQueries.contractTypes,
      });

      if (
        !existingData ||
        !existingData.contractTypes ||
        !data?.contractTypesAdd
      )
        return;

      cache.writeQuery<ContractTypeData>({
        query: contractTypeQueries.contractTypes,
        data: {
          contractTypes: {
            ...existingData.contractTypes,
            list: [...existingData.contractTypes.list, data.contractTypesAdd],
            totalCount: existingData.contractTypes.totalCount + 1,
          },
        },
      });
    },
  });

  return { contractTypesAdd, loading, error };
};
