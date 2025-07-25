import { useQuery } from '@apollo/client';
import { GET_CONTRACT_TYPE_DETAIL } from '~/modules/contractTypes/graphql/queries';
import { toast } from 'erxes-ui';

export const useContractTypeDetail = (typeId: string | null) => {
  const { data, loading } = useQuery(GET_CONTRACT_TYPE_DETAIL, {
    variables: {
      id: typeId,
    },
    skip: !typeId,
    onError: (e) => {
      toast({
        title: 'Something went wrong',
        description: e.message,
        variant: 'destructive',
      });
    },
  });

  const { savingsContractTypeDetail } = data || {};

  return { savingsContractTypeDetail, loading };
};
