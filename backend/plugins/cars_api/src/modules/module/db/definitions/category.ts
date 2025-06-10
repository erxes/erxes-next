import { Schema } from 'mongoose';

import { schemaWrapper } from 'erxes-api-shared/utils';
import { attachmentSchema } from 'erxes-api-shared/core-modules';

export const categorySchema = schemaWrapper(
  new Schema(
    {
      name: { type: String, label: 'name', required: true },
      code: { type: String, label: 'code', required: true },
      order: { type: String, label: 'order', equired: true },
      parentId: { type: String, label: 'parentId' },
      description: { type: String, label: 'description' },
      image: { type: attachmentSchema, label: 'image' },
      secondaryImage: {
        type: [attachmentSchema],
        label: 'secondaryImage',
      },
      productCategoryId: { type: String, label: 'product' },
    },
    {
      timestamps: true,
    },
  ),
);
