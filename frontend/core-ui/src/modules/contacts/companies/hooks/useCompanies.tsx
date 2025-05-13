import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  useMultiQueryState,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { GET_COMPANIES } from '@/contacts/companies/graphql/queries/getCompanies';
import { ICompany } from 'ui-modules';

export const COMPANIES_PER_PAGE = 30;

export const useCompanies = (options?: QueryHookOptions) => {
  const [{ searchValue, tags }] = useMultiQueryState<{
    searchValue: string;
    tags: string[];
    created: string;
    updated: string;
    lastSeen: string;
  }>(['searchValue', 'tags', 'created', 'updated', 'lastSeen']);

  const { data, loading, fetchMore } = useQuery<{
    companies: {
      list: ICompany[];
      totalCount: number;
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_COMPANIES, {
    ...options,
    variables: {
      limit: COMPANIES_PER_PAGE,
      searchValue,
      tags,
      ...options?.variables,
    },
  });

  const { list: companies, totalCount, pageInfo } = data?.companies || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        cursor: pageInfo?.endCursor,
        limit: COMPANIES_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          companies: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.companies,
            prevResult: prev.companies,
          }),
        });
      },
    });
  };

  return {
    loading,
    companies,
    totalCount,
    handleFetchMore,
    pageInfo,
  };
};
