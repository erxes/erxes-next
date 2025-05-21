import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ICommentParams } from '@/comments/@types/comments';

export const commentQueries = {
  courseComments: async (
    _root: undefined,
    params: ICommentParams,
    { models }: IContext,
  ) => {
    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Comments,
      params,
      query: {},
    });

    return { list, totalCount, pageInfo };
  },
  courseCommentCount: async (_root, { _id }, { models }: IContext) => {
    return models.Comments.find(_id).countDocuments();
  },
};
