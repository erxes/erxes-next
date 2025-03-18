import { Schema } from 'mongoose';
import { logicSchema, ObjectListSchema } from './common';
import { stringRandomId } from 'erxes-api-utils';

export const fieldSchema = new Schema({
  _id: stringRandomId,

  // form, customer, company
  contentType: { type: String, label: 'Content type' },

  // formId when contentType is form
  contentTypeId: { type: String, label: 'Content type item' },

  type: { type: String, label: 'Type' },
  validation: {
    type: String,
    optional: true,
    label: 'Validation',
  },
  regexValidation: {
    type: String,
    optional: true,
    label: 'Regex validation',
  },
  text: { type: String, label: 'Text' },
  field: { type: String, optional: true, label: 'Field identifier' },
  description: {
    type: String,
    optional: true,
    label: 'Description',
  },
  code: {
    type: String,
    optional: true,
    label: 'Unique code',
  },
  options: {
    type: [String],
    optional: true,
    label: 'Options',
  },
  locationOptions: {
    type: Array,
    optional: true,
    label: 'Location Options',
  },
  objectListConfigs: {
    type: [ObjectListSchema],
    optional: true,
    label: 'object list config',
  },
  optionsValues: {
    type: String,
    label: 'Field Options object',
  },
  isRequired: { type: Boolean, label: 'Is required' },
  isDefinedByErxes: { type: Boolean, label: 'Is defined by erxes' },
  order: { type: Number, label: 'Order' },
  groupId: { type: String, label: 'Field group' },
  isVisible: { type: Boolean, default: true, label: 'Is visible' },
  isVisibleInDetail: {
    type: Boolean,
    default: true,
    label: 'Is group visible in detail',
  },
  canHide: {
    type: Boolean,
    default: true,
    label: 'Can toggle isVisible',
  },
  isVisibleToCreate: {
    type: Boolean,
    default: false,
    label: 'Is visible to create',
  },
  searchable: {
    type: Boolean,
    default: false,
    label: 'Useful for searching',
  },
  lastUpdatedUserId: { type: String, label: 'Last updated by' },
  associatedFieldId: {
    type: String,
    optional: true,
    label: 'Stores custom property fieldId for form field id',
  },
  logics: { type: [logicSchema] },
  column: { type: Number, optional: true },
  logicAction: {
    type: String,
    label:
      'If action is show field will appear when logics fulfilled, if action is hide it will disappear when logic fulfilled',
  },
  content: {
    type: String,
    optional: true,
    label: 'Stores html content form of field type with html',
  },
  pageNumber: {
    type: Number,
    optional: true,
    label: 'Number of page',
    min: 1,
  },
  showInCard: {
    type: Boolean,
    default: false,
    optional: true,
    label: 'Show in card',
  },
  productCategoryId: {
    type: String,
    optional: true,
    label: 'Product category',
  },
  relationType: {
    type: String,
    optional: true,
    label: 'Relation type',
  },
  subFieldIds: {
    type: [String],
    optional: true,
    label: 'Sub field ids',
  },
  isDisabled: {
    type: Boolean,
    optional: true,
    label: 'Is Disabled',
  },
});
