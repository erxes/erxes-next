import { IContext } from '~/connectionResolvers';
// import { TeamEstimateTypes } from '~/modules/team/types';

export const teamMutations = {
  teamAdd: async (
    _parent: undefined,
    { name, description, icon, memberIds },
    { models, user }: IContext,
  ) => {
    const userId = user._id;
    memberIds = memberIds || [];
    memberIds = memberIds.includes(userId)
      ? memberIds.filter((id) => id !== userId)
      : [...memberIds];

    return models.Team.createTeam({
      teamDoc: {
        name,
        description,
        icon,
        estimateType: 0,
      },
      memberIds,
      adminId: userId,
    });
  },

  teamUpdate: async (
    _parent: undefined,
    { _id, name, description, icon, estimateType },
    { models }: IContext,
  ) => {
    return models.Team.updateTeam(_id, {
      name,
      description,
      icon,
      estimateType,
    });
  },
  teamRemove: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Team.removeTeam(_id);
  },
};
