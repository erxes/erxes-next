import { useQuery } from '@apollo/client';
import { GET_PERMISSIONS } from 'ui-modules/modules/permissions/graphql';
import {
  IPermissionResponse,
  IQueryPermissionsHookOptions,
} from 'ui-modules/modules/permissions/types/permission';

const PERMISSIONS_PER_PAGE = 30;

export const usePermissions = (options?: IQueryPermissionsHookOptions) => {
  const { data, error, loading, fetchMore } = useQuery<IPermissionResponse>(
    GET_PERMISSIONS,
    {
      ...options,
      variables: {
        limit: PERMISSIONS_PER_PAGE,
        ...options?.variables,
      },
    },
  );
  const { list = [], totalCount = 0, pageInfo } = data?.permissions || {};

  const handleFetchMore = () => {
    if (totalCount && totalCount <= list.length) return;
    if (!fetchMore) return;

    fetchMore({
      variables: {
        ...options?.variables,
        cursor: pageInfo?.endCursor,
        limit: PERMISSIONS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          permissions: {
            list: [
              ...(prev.permissions?.list || []),
              ...fetchMoreResult.permissions.list,
            ],
            totalCount: fetchMoreResult.permissions.totalCount,
            pageInfo: fetchMoreResult.permissions.pageInfo,
          },
        });
      },
    });
  };
  return {
    permissions: list,
    loading,
    handleFetchMore,
    error,
    totalCount,
    pageInfo,
  };
};
