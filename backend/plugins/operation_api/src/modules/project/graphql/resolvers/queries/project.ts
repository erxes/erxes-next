import { IContext } from '~/connectionResolvers';
import { IProjectFilter } from '@/project/@types/project';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IProjectDocument } from '@/project/@types/project';

export const projectQueries = {
  getProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.getProject(_id);
  },

  getProjects: async (
    _parent: undefined,
    params: IProjectFilter,
    { models }: IContext,
  ) => {
    const filter = {};
    const { list, totalCount, pageInfo } =
      await cursorPaginate<IProjectDocument>({
        model: models.Project,
        params,
        query: filter,
      });

    return { list, totalCount, pageInfo };
  },
};
