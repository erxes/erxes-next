import { IContext } from '~/connectionResolvers';

export const teamMutations = {
  createTeam: async (
    _parent: undefined,
    { name, description, icon, memberIds },
    { models }: IContext,
  ) => {
    return models.Team.createTeam({ name, description, icon, memberIds });
  },
  updateTeam: async (
    _parent: undefined,
    { _id, name, description, icon, memberIds },
    { models }: IContext,
  ) => {
    return models.Team.updateTeam(_id, { name, description, icon, memberIds });
  },
  removeTeam: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Team.removeTeam(_id);
  },
};
