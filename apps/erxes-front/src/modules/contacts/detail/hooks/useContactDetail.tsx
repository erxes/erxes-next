import { OperationVariables, useQuery } from '@apollo/client';
import { useQueryState } from 'nuqs';
import { CUSTOMER_DETAIL } from '@/contacts/detail/graphql/queries/customerDetailQueries';
import { useSetRecoilState } from 'recoil';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';

export const useContactDetail = (operationVariables?: OperationVariables) => {
  const [id] = useQueryState('contact_id');
  const setRendering = useSetRecoilState(renderingContactDetailAtom);
  const { data, loading } = useQuery(CUSTOMER_DETAIL, {
    variables: {
      id,
    },
    skip: !id, 
    ...operationVariables,
    onCompleted: (data) => {
      setRendering(false);
      operationVariables?.onCompleted?.(data);
    },
    onError: (error) => {
      setRendering(false);
      operationVariables?.onError?.(error);
    },
  });

  return { customerDetail: data?.customerDetail, loading };
};
