import {
  LEAD_LOAD_TYPES,
  LEAD_SUCCESS_ACTIONS,
} from '../../../modules/form/constants';
import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';
import { ruleSchema } from '../common';

export const calloutSchema = new Schema(
  {
    title: { type: String, optional: true, label: 'Title' },
    body: { type: String, optional: true, label: 'Body' },
    buttonText: { type: String, optional: true, label: 'Button text' },
    calloutImgSize: {
      type: String,
      optional: true,
      label: 'Callout image size',
    },
    featuredImage: {
      type: String,
      optional: true,
      label: 'Featured image',
    },
    skip: { type: Boolean, optional: true, label: 'Skip' },
  },
  { _id: false },
);

export const leadDataSchema = new Schema(
  {
    loadType: {
      type: String,
      enum: LEAD_LOAD_TYPES.ALL,
      label: 'Load type',
    },
    successAction: {
      type: String,
      enum: LEAD_SUCCESS_ACTIONS.ALL,
      optional: true,
      label: 'Success action',
    },
    fromEmail: {
      type: String,
      optional: true,
      label: 'From email',
    },
    userEmailTitle: {
      type: String,
      optional: true,
      label: 'User email title',
    },
    userEmailContent: {
      type: String,
      optional: true,
      label: 'User email content',
    },
    adminEmails: {
      type: [String],
      optional: true,
      label: 'Admin emails',
    },
    adminEmailTitle: {
      type: String,
      optional: true,
      label: 'Admin email title',
    },
    adminEmailContent: {
      type: String,
      optional: true,
      label: 'Admin email content',
    },
    thankTitle: {
      type: String,
      optional: true,
      label: 'Thank content title',
    },
    thankContent: {
      type: String,
      optional: true,
      label: 'Thank content',
    },
    redirectUrl: {
      type: String,
      optional: true,
      label: 'Redirect URL',
    },
    themeColor: {
      type: String,
      optional: true,
      label: 'Theme color code',
    },
    callout: {
      type: calloutSchema,
      optional: true,
      label: 'Callout',
    },
    viewCount: {
      type: Number,
      optional: true,
      label: 'View count',
      default: 0,
    },
    contactsGathered: {
      type: Number,
      optional: true,
      label: 'Contacts gathered',
      default: 0,
    },
    rules: {
      type: [ruleSchema],
      optional: true,
      label: 'Rules',
    },
    isRequireOnce: {
      type: Boolean,
      optional: true,
      label: 'Do not show again if already filled out',
    },
    saveAsCustomer: {
      type: Boolean,
      optional: true,
      label: 'Save as customer',
    },
    templateId: {
      type: String,
      optional: true,
      label: 'Template',
    },
    attachments: { type: Object, optional: true, label: 'Attachments' },
    css: {
      type: String,
      optional: true,
      label: 'Custom CSS',
    },
    successImage: {
      type: String,
      optional: true,
      label: 'Success image',
    },
    successImageSize: {
      type: String,
      optional: true,
      label: 'Success image size',
    },
    verifyEmail: {
      type: Boolean,
      optional: true,
      label: 'Verify email',
    },
    clearCacheAfterSave: {
      type: Boolean,
      optional: true,
      label: 'Clear cache after save',
    },
  },
  { _id: false },
);

export const formSchema = new Schema(
  {
    _id: stringRandomId,
    name: { type: String, required: true },
    title: { type: String, optional: true },
    type: { type: String, required: true },
    description: {
      type: String,
      optional: true,
    },
    buttonText: { type: String, optional: true },
    code: { type: String },
    createdUserId: { type: String },

    numberOfPages: {
      type: Number,
      optional: true,
      min: 1,
    },

    brandId: { type: String, optional: true, label: 'Brand' },

    leadData: { type: leadDataSchema, label: 'Lead data' },
    departmentIds: {
      type: [String],
      optional: true,
      label: 'Departments',
    },
    languageCode: { type: String, optional: true, label: 'Language' },
    visibility: { type: String, optional: true, label: 'Visibility' },
    tagIds: { type: [String], optional: true, label: 'Tags' },
    status: {
      type: String,
      optional: true,
      label: 'Status',
      enum: ['active', 'archived'],
      default: 'active',
    },
    integrationId: {
      type: String,
      optional: true,
      label: 'Integration',
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: true },
  },
);
