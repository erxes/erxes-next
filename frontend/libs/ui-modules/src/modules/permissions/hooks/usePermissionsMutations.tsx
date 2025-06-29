import { MutationHookOptions, useMutation } from '@apollo/client';
import { ADD_PERMISSIONS } from 'ui-modules/modules/permissions/graphql';
import { FIX_PERMISSIONS } from 'ui-modules/modules/permissions/graphql/mutations/fixPermissions';

export const usePermissionsAdd = () => {
  const [permissionsAdd, { loading }] = useMutation(ADD_PERMISSIONS);

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    permissionsAdd({
      ...options,
      variables,
      refetchQueries: ['Permissions'],
    });
  };

  return {
    permissionsAdd: mutate,
    loading,
  };
};

export const usePermissionsFix = () => {
  const [fix, { loading }] = useMutation(FIX_PERMISSIONS);

  const mutate = ({ ...options }: MutationHookOptions) => {
    fix({
      ...options,
      refetchQueries: ['Permissions'],
    });
  };

  return {
    permissionsFix: mutate,
    loading,
  };
};
