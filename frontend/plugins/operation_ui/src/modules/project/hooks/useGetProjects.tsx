import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/project/graphql/queries/getProjects';
import { IProject } from '@/project/types';
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
import { projectTotalCountAtom } from '@/project/states/projectsTotalCount';
import { currentUserState } from 'ui-modules';
import { useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { PROJECTS_CURSOR_SESSION_KEY } from '@/project/constants';

const PROJECTS_PER_PAGE = 30;

export const useProjectsVariables = (
  variables?: QueryHookOptions<ICursorListResponse<IProject>>['variables'],
) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: PROJECTS_CURSOR_SESSION_KEY,
  });
  const [{ name, team, priority, status, lead }] = useMultiQueryState<{
    name: string;
    team: string;
    priority: string;
    status: string;
    lead: string;
  }>(['name', 'team', 'priority', 'status', 'lead']);
  const currentUser = useAtomValue(currentUserState);

  return {
    limit: PROJECTS_PER_PAGE,
    orderBy: {
      status: 1,
    },
    cursor,
    name: name || undefined,

    priority: priority || undefined,
    status: status || undefined,
    leadId: lead || undefined,
    ...variables,
    ...(variables?.teamIds || variables?.userId || !currentUser?._id
      ? {}
      : { userId: currentUser._id }),
    teamIds: team ? [team] : variables?.teamIds,
  };
};

export const useProjects = (
  options?: QueryHookOptions<ICursorListResponse<IProject>>,
) => {
  const setProjectTotalCount = useSetAtom(projectTotalCountAtom);
  const { toast } = useToast();
  const variables = useProjectsVariables(options?.variables);

  const { data, loading, fetchMore } = useQuery<ICursorListResponse<IProject>>(
    GET_PROJECTS,
    {
      ...options,
      variables,
      skip: options?.skip || isUndefinedOrNull(variables.cursor),
      onError: (e) => {
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        });
      },
    },
  );

  const { list: projects, pageInfo, totalCount } = data?.getProjects || {};

  useEffect(() => {
    if (isUndefinedOrNull(totalCount)) return;
    setProjectTotalCount(totalCount);
  }, [totalCount, setProjectTotalCount]);

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
        limit: PROJECTS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          getProjects: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.getProjects,
            prevResult: prev.getProjects,
          }),
        });
      },
    });
  };

  return {
    loading,
    projects,
    handleFetchMore,
    pageInfo,
    totalCount,
  };
};
