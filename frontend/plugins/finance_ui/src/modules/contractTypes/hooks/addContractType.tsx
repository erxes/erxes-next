import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { IContractType } from '~/modules/contractTypes/types';
import { contractTypesMutations } from '~/modules/contractTypes/graphql/mutation';
import { contractTypeQueries } from '~/modules/contractTypes/graphql/queries';

interface contractTypeData {
  contractTypesMain: {
    list: IContractType[];
    totalCount: number;
  };
}

interface AddContractTypeResult {
  contractTypesAdd: IContractType;
}

export function useAddContractType(
  options?: MutationHookOptions<AddContractTypeResult, any>,
) {
  const [contractTypesAdd, { loading, error }] =
    useMutation<AddContractTypeResult>(
      contractTypesMutations.contractTypesAdd,
      {
        ...options,
        update: (cache: ApolloCache<any>, { data }) => {
          const existingData = cache.readQuery<contractTypeData>({
            query: contractTypeQueries.contractTypesMain,
            variables: {},
          });
          if (
            !existingData ||
            !existingData.contractTypesMain ||
            !data?.contractTypesAdd
          )
            return;
          cache.writeQuery<contractTypeData>({
            query: contractTypeQueries.contractTypesMain,
            variables: {},
            data: {
              contractTypesMain: {
                ...existingData.contractTypesMain,
                list: [
                  ...existingData.contractTypesMain.list,
                  data.contractTypesAdd,
                ],
                totalCount: existingData.contractTypesMain.totalCount + 1,
              },
            },
          });
        },
      },
    );

  return { contractTypesAdd, loading, error };
}
