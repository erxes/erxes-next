import { OperationVariables, useQuery } from '@apollo/client';
import { GET_VAT_VALUE } from '../graphql/queries/getVats';
import { IVat } from '../types/Vat';

export const useVatValue = (options?: OperationVariables) => {
  const { data, loading } = useQuery<{ vatRowDetail: IVat }>(GET_VAT_VALUE, {
    ...options,
  });

  return {
    vatRowDetail: data?.vatRowDetail,
    loading,
  };
};
