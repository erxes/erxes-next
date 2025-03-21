import { Schema } from 'mongoose';

import { mongoStringRandomId } from 'erxes-api-utils';
import { CUSTOMER_SELECT_OPTIONS } from '../../constants/customer';

const getEnum = (fieldName: string): string[] => {
  return CUSTOMER_SELECT_OPTIONS[fieldName].map((option) => option.value);
};

export const customerSchema = new Schema(
  {
    _id: mongoStringRandomId,

    state: {
      type: String,
      esType: 'keyword',
      label: 'State',
      default: 'visitor',
      enum: getEnum('STATE'),
      index: true,
      selectOptions: CUSTOMER_SELECT_OPTIONS.STATE,
    },

    createdAt: { type: Date, label: 'Created at', esType: 'date' },
    modifiedAt: { type: Date, label: 'Modified at', esType: 'date' },
    avatar: { type: String, optional: true, label: 'Avatar' },

    firstName: { type: String, label: 'First name', optional: true },
    lastName: { type: String, label: 'Last name', optional: true },
    middleName: { type: String, label: 'Middle name', optional: true },

    birthDate: {
      type: Date,
      label: 'Date of birth',
      optional: true,
      esType: 'date',
    },
    sex: {
      type: Number,
      label: 'Pronoun',
      optional: true,
      esType: 'keyword',
      default: 0,
      enum: getEnum('SEX'),
      selectOptions: CUSTOMER_SELECT_OPTIONS.SEX,
    },

    primaryEmail: {
      type: String,
      label: 'Primary Email',
      optional: true,
      esType: 'email',
    },
    emails: { type: [String], optional: true, label: 'Emails' },
    emailValidationStatus: {
      type: String,
      enum: getEnum('EMAIL_VALIDATION_STATUSES'),
      default: 'unknown',
      label: 'Email validation status',
      esType: 'keyword',
      selectOptions: CUSTOMER_SELECT_OPTIONS.EMAIL_VALIDATION_STATUSES,
    },

    primaryPhone: {
      type: String,
      label: 'Primary Phone',
      optional: true,
    },
    phones: { type: [String], optional: true, label: 'Phones' },

    primaryAddress: {
      type: Object,
      label: 'Primary Address',
      optional: true,
    },
    addresses: { type: [Object], optional: true, label: 'Addresses' },

    phoneValidationStatus: {
      type: String,
      enum: getEnum('PHONE_VALIDATION_STATUSES'),
      default: 'unknown',
      label: 'Phone validation status',
      esType: 'keyword',
      selectOptions: CUSTOMER_SELECT_OPTIONS.PHONE_VALIDATION_STATUSES,
    },

    status: {
      type: String,
      enum: getEnum('STATUSES'),
      optional: true,
      label: 'Status',
      default: 'Active',
      esType: 'keyword',
      index: true,
      selectOptions: CUSTOMER_SELECT_OPTIONS.STATUSES,
    },

    description: { type: String, optional: true, label: 'Description' },
    doNotDisturb: {
      type: String,
      optional: true,
      default: 'No',
      enum: getEnum('DO_NOT_DISTURB'),
      label: 'Do not disturb',
      selectOptions: CUSTOMER_SELECT_OPTIONS.DO_NOT_DISTURB,
    },
    isSubscribed: {
      type: String,
      optional: true,
      default: 'Yes',
      enum: getEnum('DO_NOT_DISTURB'),
      label: 'Subscribed',
      selectOptions: CUSTOMER_SELECT_OPTIONS.DO_NOT_DISTURB,
    },
    links: { type: Object, default: {}, label: 'Links' },
    code: { type: String, label: 'Code', optional: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'modifiedAt',
    },
  },
);
