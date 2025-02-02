import { OperationVariables, useQuery } from '@apollo/client';
import { ACTIVITY_LOGS } from '../graphql/queries/activityQueries';

export const useActivities = (operation?: OperationVariables) => {
  const { data, loading, error } = useQuery(ACTIVITY_LOGS, operation);

  return {
    activityLogs: data?.activityLogs,
    loading,
    error,
  };
};
