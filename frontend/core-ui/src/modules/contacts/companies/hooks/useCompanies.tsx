import { QueryHookOptions, useQuery } from '@apollo/client';

import { GET_COMPANIES } from '@/contacts/companies/graphql/queries/getCompanies';

export const COMPANIES_PER_PAGE = 30;

export const useCompanies = (options?: QueryHookOptions) => {
  const { data, loading, fetchMore } = useQuery(GET_COMPANIES, {
    ...options,
    variables: {
      perPage: COMPANIES_PER_PAGE,
      ...options?.variables,
    },
  });

  const { list: companies, totalCount } = data?.companiesMain || {};

  const handleFetchMore = () =>
    totalCount > companies?.length &&
    fetchMore({
      variables: {
        page: Math.ceil(companies.length / COMPANIES_PER_PAGE) + 1,
        perPage: COMPANIES_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          companiesMain: {
            ...prev.companiesMain,
            list: [
              ...(prev.companiesMain?.list || []),
              ...(fetchMoreResult.companiesMain?.list || []),
            ],
          },
        });
      },
    });

  return {
    loading,
    companies,
    totalCount,
    handleFetchMore,
  };
};
