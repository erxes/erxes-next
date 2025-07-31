import { IContext } from '~/connectionResolvers';

export const projectMutations = {
  createProject: async (
    _parent: undefined,
    { name, teamId, startDate, endDate },
    { models }: IContext,
  ) => {
    return models.Project.createProject({ name, teamId, startDate, endDate });
  },
  updateProject: async (
    _parent: undefined,
    { _id, name, teamId, startDate, endDate },
    { models }: IContext,
  ) => {
    return models.Project.updateProject(_id, {
      name,
      teamId,
      startDate,
      endDate,
    });
  },
  removeProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.removeProject(_id);
  },
};
