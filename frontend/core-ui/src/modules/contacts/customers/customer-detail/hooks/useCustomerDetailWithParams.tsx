import { OperationVariables } from '@apollo/client';

import { renderingCustomerDetailAtom } from '@/contacts/states/customerDetailStates';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { useCustomerDetail } from 'ui-modules';

export const useCustomerDetailWithParams = (
  operationVariables?: OperationVariables,
) => {
  const [_id] = useQueryState('contactId');
  const setRendering = useSetAtom(renderingCustomerDetailAtom);

  const { customerDetail, loading, error } = useCustomerDetail({
    ...operationVariables,
    variables: {
      _id,
    },
    skip: !_id,
    onCompleted(data) {
      setRendering(false);
      operationVariables?.onCompleted?.(data);
    },
    onError(error) {
      setRendering(false);
      operationVariables?.onError?.(error);
    },
  });

  return { customerDetail, loading, error };
};
