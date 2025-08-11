import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_TASKS } from '@/task/graphql/queries/getTasks';
import { ITask } from '~/modules/task/types';
import {
  useRecordTableCursor,
  mergeCursorData,
  validateFetchMore,
  EnumCursorDirection,
  ICursorListResponse,
  useMultiQueryState,
} from 'erxes-ui';
import { taskTotalCountAtom } from '@/task/states/tasksTotalCount';
import { currentUserState } from 'ui-modules/states';
import { useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { TASKS_CURSOR_SESSION_KEY } from '@/task/constants';

const TASKS_PER_PAGE = 30;

export const useTasksVariables = (
  variables?: QueryHookOptions<ICursorListResponse<ITask>>['variables'],
) => {
  const [{ searchValue, team, priority, status }] = useMultiQueryState<{
    searchValue: string;
    team: string[];
    priority: string;
    status: string;
  }>(['searchValue', 'team', 'priority', 'status']);

  const currentUser = useAtomValue(currentUserState);
  const { cursor } = useRecordTableCursor({
    sessionKey: TASKS_CURSOR_SESSION_KEY,
  });

  const tasksQueryVariables = {
    limit: TASKS_PER_PAGE,
    orderBy: {
      createdAt: -1,
    },
    cursor,
    searchValue: searchValue || undefined,
    teamIds: team || undefined,
    priority: priority || undefined,
    status: status || undefined,
    ...variables,
    ...(!variables?.teamIds &&
      !variables?.userIds &&
      currentUser?._id && {
        userIds: [currentUser._id],
      }),
  };
  return { tasksQueryVariables };
};

export const useTasks = (
  options?: QueryHookOptions<ICursorListResponse<ITask>>,
) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: TASKS_CURSOR_SESSION_KEY,
  });
  const setTaskTotalCount = useSetAtom(taskTotalCountAtom);
  const { data, loading, fetchMore } = useQuery<ICursorListResponse<ITask>>(
    GET_TASKS,
    {
      ...options,
      variables: useTasksVariables(options?.variables)?.tasksQueryVariables,
      skip: cursor === undefined,
    },
  );

  const { list: tasks, pageInfo, totalCount } = data?.getTasks || {};

  useEffect(() => {
    if (!totalCount) return;
    setTaskTotalCount(totalCount);
  }, [totalCount, setTaskTotalCount]);

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
        limit: TASKS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          getTasks: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.getTasks,
            prevResult: prev.getTasks,
          }),
        });
      },
    });
  };

  return {
    loading,
    tasks,
    handleFetchMore,
    pageInfo,
    totalCount,
  };
};
