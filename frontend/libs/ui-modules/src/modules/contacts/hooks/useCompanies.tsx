import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_COMPANIES } from '../graphql/queries/getCompanies';
import { ICompany } from '../types';
import { EnumCursorDirection, ICursorListResponse } from 'erxes-ui';

export const useCompanies = (
  options?: QueryHookOptions<ICursorListResponse<ICompany>>,
) => {
  const COMPANIES_PER_PAGE = 30;
  const { data, loading, fetchMore, error } = useQuery<
    ICursorListResponse<ICompany>
  >(GET_COMPANIES, {
    ...options,
    variables: {
      perPage: COMPANIES_PER_PAGE,
      ...options?.variables,
    },
  });

  const {
    list: companies = [],
    totalCount = 0,
    pageInfo,
  } = data?.companies || {};

  const handleFetchMore = () => {
    if (totalCount <= companies?.length) {
      return;
    }
    fetchMore({
      variables: {
        ...options?.variables,
        direction: EnumCursorDirection.FORWARD,
        cursor: pageInfo?.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          companies: {
            list: [
              ...(prev.companies?.list || []),
              ...fetchMoreResult.companies.list,
            ],
            totalCount: fetchMoreResult.companies.totalCount,
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
