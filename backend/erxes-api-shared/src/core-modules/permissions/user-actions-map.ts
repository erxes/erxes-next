import {
  IActionMap,
  IPermissionDocument,
} from '../../core-types/modules/permissions/permission';

export const userActionsMap = async (
  userPermissions: IPermissionDocument[],
  groupPermissions: IPermissionDocument[],
  user: any,
): Promise<IActionMap> => {
  const totalPermissions: IPermissionDocument[] = [
    ...userPermissions,
    ...groupPermissions,
    ...(user.customPermissions || []),
  ];
  const allowedActions: IActionMap = {};

  const check = (name: string, allowed: boolean) => {
    if (typeof allowedActions[name] === 'undefined') {
      allowedActions[name] = allowed;
    }

    // if a specific permission is denied elsewhere, follow that rule
    if (allowedActions[name] && !allowed) {
      allowedActions[name] = false;
    }
  };

  for (const { requiredActions, allowed, action } of totalPermissions) {
    if (requiredActions.length > 0) {
      for (const actionName of requiredActions) {
        check(actionName, allowed);
      }
    } else {
      check(action, allowed);
    }
  }

  return allowedActions;
};
