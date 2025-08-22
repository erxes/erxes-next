import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_TASKS } from '@/task/graphql/queries/getTasks';
import { ITask } from '@/task/types';
import {
  useRecordTableCursor,
  mergeCursorData,
  validateFetchMore,
  EnumCursorDirection,
  ICursorListResponse,
  useMultiQueryState,
  useToast,
  isUndefinedOrNull,
} from 'erxes-ui';
import { useParams } from 'react-router-dom';
import { taskTotalCountAtom } from '@/task/states/tasksTotalCount';
import { currentUserState } from 'ui-modules';
import { useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { TASKS_CURSOR_SESSION_KEY } from '@/task/constants';
import { TASKS_CHANGED } from '@/task/graphql/subscriptions/tasksChanged';

const TASKS_PER_PAGE = 30;

export const useTasksVariables = (
  variables?: QueryHookOptions<ICursorListResponse<ITask>>['variables'],
) => {
  const { teamId } = useParams();
  const [{ searchValue, assignee, team, priority, statusType, status }] =
    useMultiQueryState<{
      searchValue: string;
      assignee: string;
      team: string;
      priority: string;
      status: string;
      statusType: string;
    }>(['searchValue', 'assignee', 'team', 'priority', 'status', 'statusType']);
  const currentUser = useAtomValue(currentUserState);
  const { cursor } = useRecordTableCursor({
    sessionKey: TASKS_CURSOR_SESSION_KEY,
  });

  return {
    limit: TASKS_PER_PAGE,
    orderBy: {
      createdAt: -1,
    },
    cursor,
    searchValue: searchValue || undefined,
    assigneeId: assignee || undefined,
    teamId: teamId || team,
    priority: priority || undefined,
    status: status || undefined,
    statusType: statusType || undefined,
    ...variables,
    ...(!variables?.teamId &&
      !variables?.userId &&
      !assignee &&
      currentUser?._id && {
        userId: currentUser._id,
      }),
  };
};

export const useTasks = (
  options?: QueryHookOptions<ICursorListResponse<ITask>>,
) => {
  const setTaskTotalCount = useSetAtom(taskTotalCountAtom);
  const variables = useTasksVariables(options?.variables);
  const { toast } = useToast();
  const { data, loading, fetchMore, subscribeToMore } = useQuery<
    ICursorListResponse<ITask>
  >(GET_TASKS, {
    ...options,
    variables: { filter: variables },
    skip: options?.skip || isUndefinedOrNull(variables.cursor),
    onError: (e) => {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
    },
  });

  const { list: tasks, pageInfo, totalCount } = data?.getTasks || {};

  useEffect(() => {
    const unsubscribe = subscribeToMore<any>({
      document: TASKS_CHANGED,
      variables: { filter: variables },
    });

    return () => unsubscribe();
  }, [subscribeToMore, variables]);

  useEffect(() => {
    if (isUndefinedOrNull(totalCount)) return;
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
