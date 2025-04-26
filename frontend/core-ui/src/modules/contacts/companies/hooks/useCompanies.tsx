import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { GET_COMPANIES } from '@/contacts/companies/graphql/queries/getCompanies';
import { ICompany } from 'ui-modules';

export const COMPANIES_PER_PAGE = 30;

export const useCompanies = (options?: QueryHookOptions) => {
  const { cursor, setCursor } = useRecordTableCursor({
    sessionKey: 'companies_cursor',
  });

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
      cursor,
      ...options?.variables,
    },
  });

  const { list: companies, totalCount, pageInfo } = data?.companies || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (
      !validateFetchMore({
        direction,
        pageInfo,
      })
    ) {
      return;
    }

    fetchMore({
      variables: {
        cursor: pageInfo?.endCursor,
        limit: COMPANIES_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        setCursor(prev?.companies?.pageInfo?.endCursor);
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
