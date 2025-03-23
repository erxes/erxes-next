import { OperationVariables, useQuery } from '@apollo/client';
import { companiesQuery } from '@/products/graphql/companiesQuery';
import { TCompany } from '@/contacts/types/companyType';

interface IData {
  companies?: TCompany[];
  companyCounts?: number;
}

export const useCompanies = (options?: OperationVariables) => {
  const COMPANIES_PER_PAGE = 10;
  const { data, loading, fetchMore } = useQuery<IData>(companiesQuery, {
    ...options,
    variables: {
      perPage: COMPANIES_PER_PAGE,
      page: 1,
      ...options?.variables,
    },
  });

  const companies = data?.companies;
  const totalCount = data?.companyCounts;

  const handleFetchMore = () => {
    if ((totalCount || 0) <= (companies?.length || 0)) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((companies?.length || 1) / COMPANIES_PER_PAGE) + 1,
        perPage: COMPANIES_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          companies: [
            ...(prev.companies || []),
            ...(fetchMoreResult.companies || []),
          ],
        });
      },
    });
  };
  return {
    companies: companies || [],
    loading,
    handleFetchMore,
    totalCount: totalCount || 0,
  };
};
