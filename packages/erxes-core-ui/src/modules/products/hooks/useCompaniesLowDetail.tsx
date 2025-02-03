import { useQuery } from '@apollo/client';

import { companiesLowDetailQuery } from '@/products/graphql/companiesQuery';

export const useCompaniesLowDetail = () => {
  const { data, loading } = useQuery(companiesLowDetailQuery, {
    variables: {
    },
  });

  return {
    companies: data?.companies,
    loading,
  };
};
