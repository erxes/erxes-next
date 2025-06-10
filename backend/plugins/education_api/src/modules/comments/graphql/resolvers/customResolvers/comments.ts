import { IContext } from '~/connectionResolvers';
import { ICommentDocument } from '@/comments/@types/comments';

export default {
  childCount: async (comment: ICommentDocument, _, { models }: IContext) => {
    return models.Comments.find({
      parentId: comment._id,
    }).countDocuments();
  },
};
