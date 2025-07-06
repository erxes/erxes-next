import { OperationVariables, useQuery } from '@apollo/client';
import { CUSTOMER_DETAIL } from '@/contacts/customers/customer-detail/graphql/queries/customerDetailQueries';
import { renderingCustomerDetailAtom } from '@/contacts/states/customerDetailStates';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { ICustomerDetail } from 'ui-modules';

interface IUseCustomerDetailResponseData {
    customerDetail: ICustomerDetail;
}

export const useCustomerDetail = (operationVariables?: OperationVariables) => {
  const [_id] = useQueryState('contactId');
  const setRendering = useSetAtom(renderingCustomerDetailAtom);
  const { data, loading } = useQuery<IUseCustomerDetailResponseData>(CUSTOMER_DETAIL, {
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
