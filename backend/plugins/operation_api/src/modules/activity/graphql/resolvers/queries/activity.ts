import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const activityQueries = {
  getOperationActivities: async (
    _parent: undefined,
    params: any,
    { models }: IContext,
  ) => {
    return cursorPaginate({
      model: models.Activity,
      params: { ...params, orderBy: { createdAt: 1 } },
      query: { contentId: params.contentId },
    });
  },
};
