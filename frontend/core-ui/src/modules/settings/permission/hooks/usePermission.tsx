import { useQuery } from '@apollo/client';
import { queries } from '../graphql';

type TPermissionsVars = {
  page: number;
  perPage: number;
  module?: string;
  action?: string;
  userId?: string;
  groupId?: string;
  allowed?: boolean;
};

const usePermissions = (variables: TPermissionsVars) => {
  const { data, loading, error } = useQuery(queries.getPermissionsQuery, {
    variables,
    onError(error) {
      console.error('An error occoured on fetch', error.message);
    },
  });

  const permissions = data?.permissions || [];
  return {
    permissions,
    loading,
    error,
  };
};

const usePermissionActions = () => {
  return {};
};

const usePermissionModules = () => {
  return {};
};

export { usePermissions, usePermissionActions, usePermissionModules };
