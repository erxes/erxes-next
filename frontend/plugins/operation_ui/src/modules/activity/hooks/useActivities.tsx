import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVITIES } from '@/activity/graphql/queries/getActivityLogs';
import { IActivity } from '@/activity/types';
import { ICursorListResponse } from 'erxes-ui';
import { ACTIVITY_CHANGED } from '@/activity/graphql/subsciptions/activityChanged';

export const useActivities = (contentId: string) => {
  const { data, loading, refetch, subscribeToMore } = useQuery<
    ICursorListResponse<IActivity>
  >(GET_ACTIVITIES, {
    variables: {
      contentId,
    },
  });

  const {
    list: activities,
    pageInfo,
    totalCount,
  } = data?.getOperationActivities || {};

  useEffect(() => {
    const unsubscribe = subscribeToMore<any>({
      document: ACTIVITY_CHANGED,
      variables: { contentId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!prev || !subscriptionData.data) return prev;

        const newData = subscriptionData.data.operationActivityChanged;

        const prevList = prev.getOperationActivities.list;

        const existsIndex = prevList.findIndex(
          (item: any) => item._id === newData._id,
        );

        let updatedList;

        if (existsIndex !== -1) {
          updatedList = [
            newData,
            ...prevList.filter((_, idx) => idx !== existsIndex),
          ];
        } else {
          updatedList = [newData, ...prevList];
        }

        return {
          ...prev,
          getOperationActivities: {
            ...prev.getOperationActivities,
            list: updatedList,
          },
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [contentId, subscribeToMore]);

  return { activities, loading, refetch, pageInfo, totalCount };
};
