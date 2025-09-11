import { IPageDocument } from '@/portal/@types/page';
import { customFieldSchema } from 'erxes-api-shared/core-modules';
import { Schema } from 'mongoose';

export const pageSchema = new Schema<IPageDocument>(
  {
    clientPortalId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    slug: { type: String, required: true },
    layout: { type: String, required: false },
    createdUserId: { type: String, ref: 'User' },
    coverImage: { type: String },
    customFieldsData: { type: [customFieldSchema], optional: true },
    pageItems: [
      {
        name: { type: String },
        type: { type: String, required: true },
        content: { type: Schema.Types.Mixed },
        order: { type: Number, required: true },
        contentType: { type: String },
        contentTypeId: { type: String },
        config: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true },
);

pageSchema.index({ slug: 1, clientPortalId: 1 }, { sparse: true });
