import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IComment, ICommentDocument } from '~/modules/tickets/@types/comment';
import { commentSchema } from '~/modules/tickets/db/definitions/comments';

export interface ICommentModel extends Model<ICommentDocument> {
  getComment(typeId: string): Promise<ICommentDocument>;
  createComment(comment: IComment): Promise<ICommentDocument>;
  deleteComment(_id: string): void;
}

export const loadCommentClass = (models: IModels) => {
  class Comment {
    /**
     * Retreives comment
     */
    public static async getComment(typeId: string) {
      const comment = await models.Comments.findOne({ typeId });

      if (!comment) {
        throw new Error('Comment not found');
      }

      return comment;
    }

    public static async createComment(comment: IComment) {
      return models.Comments.create(comment);
    }

    public static async deleteComment(_id: string) {
      return models.Comments.deleteOne({ _id });
    }
  }

  commentSchema.loadClass(Comment);

  return commentSchema;
};
