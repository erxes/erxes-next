import { IContext } from '~/connectionResolvers';
import { IComment } from '@/comments/@types/comments';

export const commentMutations = {
  courseCommentAdd: async (_root, doc: IComment, { models }: IContext) => {
    return await models.Comments.createComment(doc);
  },
  courseCommentEdit: async (
    _root,
    { _id, ...doc }: { _id: string } & IComment,
    { models }: IContext,
  ) => {
    return await models.Comments.updateComment(_id, doc);
  },
  courseCommentRemove: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    await models.Comments.deleteComment(_id);

    return _id;
  },
};
