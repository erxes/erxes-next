import { useQuery } from '@apollo/client';
import { GET_ACTIVITIES } from '@/activity/graphql/queries/getActivityLogs';
import { IActivity } from '@/activity/types';
import { ICursorListResponse } from 'erxes-ui';

export const useActivities = (contentId: string) => {
  const { data, loading, refetch } = useQuery<ICursorListResponse<IActivity>>(
    GET_ACTIVITIES,
    {
      variables: {
        contentId,
      },
    },
  );

  const {
    list: activities,
    pageInfo,
    totalCount,
  } = data?.getOperationActivities || {};

  return { activities, loading, refetch, pageInfo, totalCount };
};
