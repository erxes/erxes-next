import { IContext } from '~/connectionResolvers';

export const teamMutations = {
  teamAdd: async (
    _parent: undefined,
    { name, description, icon, memberIds },
    { models }: IContext,
  ) => {
    return models.Team.createTeam({ name, description, icon, memberIds });
  },
  teamUpdate: async (
    _parent: undefined,
    { _id, name, description, icon, memberIds },
    { models }: IContext,
  ) => {
    return models.Team.updateTeam(_id, { name, description, icon, memberIds });
  },
  teamRemove: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Team.removeTeam(_id);
  },
};
