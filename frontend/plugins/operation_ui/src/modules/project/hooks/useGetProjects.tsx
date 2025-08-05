import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/project/graphql/queries/getProjects';
import { ICustomer } from 'ui-modules';
import {
  useRecordTableCursor,
  mergeCursorData,
  validateFetchMore,
  EnumCursorDirection,
  ICursorListResponse,
  useMultiQueryState,
} from 'erxes-ui';
import { projectTotalCountAtom } from '@/project/states/projectsTotalCount';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { PROJECTS_CURSOR_SESSION_KEY } from '@/project/constants';

const PROJECTS_PER_PAGE = 30;

export const useProjectsVariables = (
  variables?: QueryHookOptions<ICursorListResponse<ICustomer>>['variables'],
) => {
  const [{ searchValue }] = useMultiQueryState<{
    searchValue: string;
  }>(['searchValue']);

  const { cursor } = useRecordTableCursor({
    sessionKey: PROJECTS_CURSOR_SESSION_KEY,
  });

  const projectsQueryVariables = {
    limit: PROJECTS_PER_PAGE,
    orderBy: {
      createdAt: -1,
    },
    cursor,
    searchValue: searchValue || undefined,

    ...variables,
  };
  return { projectsQueryVariables };
};

export const useProjects = (
  options?: QueryHookOptions<ICursorListResponse<ICustomer>>,
) => {
  const setProjectTotalCount = useSetAtom(projectTotalCountAtom);
  // Customer Filter implementation
  const { data, loading, fetchMore } = useQuery<ICursorListResponse<ICustomer>>(
    GET_PROJECTS,
    {
      ...options,
      variables: useProjectsVariables(options?.variables)
        ?.projectsQueryVariables,
    },
  );

  const { list: projects, pageInfo, totalCount } = data?.projects || {};

  useEffect(() => {
    if (!totalCount) return;
    setProjectTotalCount(totalCount);
  }, [totalCount]);

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
          projects: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.projects,
            prevResult: prev.projects,
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
