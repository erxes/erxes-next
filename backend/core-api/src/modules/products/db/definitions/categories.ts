import { attachmentSchema } from 'erxes-api-shared/core-modules';
import { Schema } from 'mongoose';
import {
  PRODUCT_CATEGORY_MASK_TYPES,
  PRODUCT_CATEGORY_STATUSES,
} from '../../constants';

export const productCategorySchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },
    order: { type: String, label: 'Order' },
    parentId: { type: String, optional: true, label: 'Parent' },
    description: { type: String, optional: true, label: 'Description' },
    meta: { type: String, optional: true, label: 'Meta' },
    attachment: { type: attachmentSchema },
    status: {
      type: String,
      enum: PRODUCT_CATEGORY_STATUSES.ALL,
      optional: true,
      label: 'Status',
      default: 'active',
      esType: 'keyword',
      index: true,
    },
    maskType: {
      type: String,
      optional: true,
      label: 'Mask type',
      enum: PRODUCT_CATEGORY_MASK_TYPES.ALL,
    },
    mask: { type: Object, label: 'Mask', optional: true },
    isSimilarity: {
      type: Boolean,
      label: 'is Similarity',
      optional: true,
    },
    similarities: {
      type: [{ id: String, groupId: String, fieldId: String, title: String }],
      optional: true,
    },
  },
  {
    timestamps: true,
  },
);
