import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { COMMENT_USER_TYPES } from '~/modules/tickets/constants';

export const commentSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    typeId: { type: String, label: 'Type Id' },
    type: { type: String, label: 'Type' },

    content: { type: String, label: 'Content' },
    parentId: { type: String, label: 'Parent Id' },

    userId: { type: String, label: 'User Id' },
    userType: {
      type: String,
      enum: COMMENT_USER_TYPES.ALL,
      label: 'User Type',
    },
  },
  {
    timestamps: true,
  },
);
