import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { AUTOMATION_HISTORIES } from '@/automations/graphql/automationQueries';
import { useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  validateFetchMore,
} from 'erxes-ui';
import { useParams } from 'react-router';
export const useAutomationHistories = () => {
  const { id } = useParams();

  const { actionsConst = [], triggersConst = [] } = useAutomation();
  const { data, loading, fetchMore, refetch } = useQuery(AUTOMATION_HISTORIES, {
    variables: { automationId: id },
  });

  const { automationHistories } = data || {};

  const { list = [], totalCount = 0, pageInfo } = automationHistories || {};

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
