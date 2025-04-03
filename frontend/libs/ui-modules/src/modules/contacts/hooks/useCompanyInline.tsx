import { OperationVariables, useQuery } from '@apollo/client';
import { COMPANY_INLINE } from '../graphql/queries/getInlineCompany';

export const useCompanyInline = (options: OperationVariables) => {
  const { data, loading } = useQuery(COMPANY_INLINE, options);

  return {
    loading,
    companyDetail: data?.companyDetail,
  };
};
