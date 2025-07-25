import { useQuery } from '@apollo/client';
import { GET_CONTRACT_TYPE_DETAIL } from '~/modules/contractTypes/graphql/queries';
import { IContractType } from '~/modules/contractTypes/types';

export const useIntegrationDetail = ({ typeId }: { typeId: string | null }) => {
  const { data, loading } = useQuery<{ contractTypeDetail: IContractType }>(
    GET_CONTRACT_TYPE_DETAIL,
    {
      variables: {
        id: typeId,
      },
      skip: !typeId,
    },
  );

  return {
    contractTypeDetail: data?.contractTypeDetail,
    loading,
  };
};
