import { IContext } from '~/connectionResolvers';
import { IProjectFilter } from '@/project/@types/project';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IProjectDocument } from '@/project/@types/project';
import { FilterQuery } from 'mongoose';

export const projectQueries = {
  getProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.getProject(_id);
  },

  getProjects: async (
    _parent: undefined,
    params: IProjectFilter,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IProjectDocument> = {};

    if (params.teamIds) {
      filter.teamIds = { $in: params.teamIds };
    }

    if (params.name) {
      filter.name = { $regex: params.name, $options: 'i' };
    }

    if (params.status) {
      filter.status = params.status;
    }

    if (params.priority) {
      filter.priority = params.priority;
    }

    if (params.startDate) {
      filter.startDate = { $gte: params.startDate };
    }

    if (params.targetDate) {
      filter.targetDate = { $gte: params.targetDate };
    }

    if (params.leadId) {
      filter.leadId = params.leadId;
    }

    if (params.userId) {
      const members = await models.TeamMember.find({
        memberId: params.userId,
      }).distinct('teamId');

      filter.teamIds = { $in: members };
    }

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IProjectDocument>({
        model: models.Project,
        params,
        query: filter,
      });

    return { list, totalCount, pageInfo };
  },
};
