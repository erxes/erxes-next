import { OperationVariables, useQuery } from '@apollo/client';
import { GET_COMPANIES } from '../graphql/queries/getCompanies';

export const useCompanies = (options?: OperationVariables) => {
  const COMPANIES_PER_PAGE = 30;
  const { data, loading, fetchMore, error } = useQuery(GET_COMPANIES, {
    ...options,
    variables: {
      perPage: COMPANIES_PER_PAGE,
      ...options?.variables,
    },
  });
  const companies = data?.companiesMain?.list;
  const totalCount = data?.companiesMain?.totalCount;

  const handleFetchMore = () => {
    if (totalCount <= companies?.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((companies?.length || 1) / COMPANIES_PER_PAGE) + 1,
        perPage: COMPANIES_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          companiesMain: {
            list: [
              ...(prev.companiesMain?.list || []),
              ...fetchMoreResult.companiesMain.list,
            ],
            totalCount: fetchMoreResult.companiesMain.totalCount,
          },
        });
      },
    });
  };

  return {
    companies,
    loading,
    handleFetchMore,
    totalCount,
    error,
  };
};
