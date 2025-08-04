import { IContext } from '~/connectionResolvers';
import { IProjectFilter } from '@/project/@types/project';

export const projectQueries = {
  getProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.getProject(_id);
  },

  getProjects: async (
    _parent: undefined,
    params: IProjectFilter,
    { models }: IContext,
  ) => {
    return models.Project.getProjects(params);
  },
};
