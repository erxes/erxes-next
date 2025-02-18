import { OperationVariables, useQuery } from '@apollo/client';
import { useQueryState } from 'nuqs';
import { CUSTOMER_DETAIL } from '@/contacts/detail/graphql/queries/customerDetailQueries';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { useSetAtom } from 'jotai';

export const useContactDetail = (operationVariables?: OperationVariables) => {
  const [_id] = useQueryState('contact_id');
  const setRendering = useSetAtom(renderingContactDetailAtom);
  const { data, loading } = useQuery(CUSTOMER_DETAIL, {
    variables: {
      _id,
    },
    skip: !_id,
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
