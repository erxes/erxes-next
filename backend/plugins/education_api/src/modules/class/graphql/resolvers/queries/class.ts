import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IClassParams } from '~/modules/class/@types/classes';

export const classQueries = {
  courseClasses: async (
    _root: undefined,
    params: IClassParams,
    { models }: IContext,
  ) => {
    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Classes,
      params,
      query: {},
    });

    return { list, totalCount, pageInfo };
  },
  classDetail: async (_root, { _id }, { models }: IContext) => {
    return models.Classes.getClass(_id);
  },
};
