import { OperationVariables, useQuery } from '@apollo/client';
import { CUSTOMER_INLINE } from '../graphql/queries/getInlineCustomer';

export const useCustomerInline = (options: OperationVariables) => {
  const { data, loading } = useQuery(CUSTOMER_INLINE, options);

  return {
    loading,
    customerDetail: data?.customerDetail,
  };
};
