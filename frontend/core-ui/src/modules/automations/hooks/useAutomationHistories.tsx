import {
  AUTOMATION_HISTORIES,
  AUTOMATOMATION_CONSTANTS,
} from '@/automations/graphql/automationQueries';
import { gql, useQuery } from '@apollo/client';
import { ColumnDef } from '@tanstack/table-core';
import {
  EnumCursorDirection,
  mergeCursorData,
  RecordTable,
  validateFetchMore,
} from 'erxes-ui';
import { useParams } from 'react-router';
import { ConstantsQueryResponse } from '../types';
export const useAutomationHistories = () => {
  const { id } = useParams();

  const { data, loading, fetchMore, refetch } = useQuery(AUTOMATION_HISTORIES, {
    variables: { automationId: id },
  });

  const { automationConstants, automationHistories } = data || {};

  const { list = [], totalCount = 0, pageInfo } = automationHistories || {};
  const { triggersConst = [], actionsConst = [] } = automationConstants || {};

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) {
      return;
    }

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: 20,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          automationHistories: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.automationHistories,
            prevResult: prev.automationHistories,
          }),
        });
      },
    });
  };

  return {
    list,
    totalCount,
    loading,
    hasPreviousPage,
    hasNextPage,
    triggersConst,
    actionsConst,
    handleFetchMore,
    refetch,
  };
};
