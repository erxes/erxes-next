import { attachmentSchema, customFieldSchema } from 'erxes-core-modules';
import { mongoStringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';
import { PRODUCT_STATUSES, PRODUCT_TYPES } from '../../constants';
import { subUomSchema } from './uoms';

export const productSchema = new Schema(
  {
    _id: mongoStringRandomId,
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
