import {
  attachmentSchema,
  customFieldSchema,
  PRODUCT_CATEGORY_MASK_TYPES,
  PRODUCT_CATEGORY_STATUSES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  stringRandomId,
  TIMELY_TYPES,
} from 'erxes-api-utils';
import { Schema } from 'mongoose';

export const productsConfigSchema = new Schema({
  _id: stringRandomId,
  code: { type: String, unique: true },
  value: { type: Object },
});

export const subscriptionConfigSchema = new Schema({
  period: { type: String, label: 'Subscription Period`' },
  rule: { type: String, label: 'Subscription Rule' },
  specificDay: {
    type: String,
    label: 'Subscription Start Day',
    optional: true,
  },

  subsRenewable: {
    type: Boolean,
    label: 'Subscription Renewable',
    optional: true,
  },
});

export const subUomSchema = new Schema({
  _id: stringRandomId,
  uom: { type: String, label: 'Sub unit of measurement' },
  ratio: { type: Number, label: 'ratio of sub uom to main uom' },
});

export const productUomSchema = new Schema(
  {
    _id: stringRandomId,
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },

    isForSubscription: {
      type: Boolean,
      optional: true,
      label: 'Uom for subscription',
    },
    subscriptionConfig: {
      type: subscriptionConfigSchema,
      optional: true,
      label: 'Subscription configuration',
    },
    timely: {
      type: String,
      optional: true,
      label: 'Timely',
      enum: TIMELY_TYPES.ALL,
    },
  },
  {
    timestamps: true,
  },
);

export const productCategorySchema = new Schema(
  {
    _id: stringRandomId,
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
      label: 'is Similiraties',
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

export const productSchema = new Schema(
  {
    _id: stringRandomId,
    name: { type: String, label: 'Name' },
    shortName: { type: String, optional: true, label: 'Short name' },
    code: { type: String, unique: true, label: 'Code' },
    categoryId: { type: String, label: 'Category' },
    type: {
      type: String,
      enum: PRODUCT_TYPES.ALL,
      default: PRODUCT_TYPES.PRODUCT,
      label: 'Type',
    },
    tagIds: {
      type: [String],
      optional: true,
      label: 'Tags',
      index: true,
    },
    barcodes: {
      type: [String],
      optional: true,
      label: 'Barcodes',
      index: true,
    },
    variants: { type: Object, optional: true },
    barcodeDescription: {
      type: String,
      optional: true,
      label: 'Barcode Description',
    },
    description: { type: String, optional: true, label: 'Description' },
    unitPrice: { type: Number, optional: true, label: 'Unit price' },
    customFieldsData: {
      type: [customFieldSchema],
      optional: true,
      label: 'Custom fields data',
    },

    attachment: { type: attachmentSchema },
    attachmentMore: { type: [attachmentSchema] },
    status: {
      type: String,
      enum: PRODUCT_STATUSES.ALL,
      optional: true,
      label: 'Status',
      default: 'active',
      esType: 'keyword',
      index: true,
    },
    vendorId: { type: String, optional: true, label: 'Vendor' },
    mergedIds: { type: [String], optional: true },

    uom: {
      type: String,
      optional: true,
      label: 'Main unit of measurement',
    },
    subUoms: {
      type: [subUomSchema],
      optional: true,
      label: 'Sub unit of measurements',
    },
    sameMasks: { type: [String] },
    sameDefault: { type: [String] },
    currency: {
      type: String,
      optional: true,
      label: 'Currency',
    },

    pdfAttachment: {
      type: Object,
      optional: true,
      label: 'PDF attachment',
    },
  },
  {
    timestamps: true,
  },
);
