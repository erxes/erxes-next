import { IModels } from '~/connectionResolvers';

export const checkUserRole = async (
  models: IModels,
  teamId: string,
  userId: string,
  allowedRoles: string[],
) => {
  const userRole = await models.TeamMember.findOne({
    teamId,
    memberId: userId,
  });

  if (!userRole) {
    throw new Error('User not in team');
  }

  if (!allowedRoles.includes(userRole.role)) {
    throw new Error('User is not authorized to perform this action');
  }

  return userRole.role;
};
