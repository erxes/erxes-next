import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

const detailSchema = new Schema(
  {
    avatar: { type: String, label: 'Avatar' },
    coverPhoto: { type: String, label: 'Cover photo' },
    shortName: {
      type: String,
      optional: true,
      label: 'Short name',
    },
    fullName: { type: String, label: 'Full name' },
    birthDate: { type: Date, label: 'Birth date' },
    workStartedDate: {
      type: Date,
      label: 'Date to joined to work',
    },
    position: { type: String, label: 'Position' },
    location: {
      type: String,
      optional: true,
      label: 'Location',
    },
    description: {
      type: String,
      optional: true,
      label: 'Description',
    },
    operatorPhone: {
      type: String,
      optional: true,
      label: 'Operator phone',
    },
    firstName: { type: String, label: 'First name' },
    middleName: { type: String, label: 'Middle name' },
    lastName: { type: String, label: 'Last name' },
  },
  { _id: false },
);

export const studentSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    username: { type: String, label: 'Username' },
    password: { type: String, optional: true },
    email: {
      type: String,
      unique: true,
      /**
       * RFC 5322 compliant regex. Taken from http://emailregex.com/
       */
      match: [
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/,
        'Please fill a valid email address',
      ],
      label: 'Email',
    },
    details: {
      type: detailSchema,
      default: {},
      label: 'Details',
    },
    links: { type: Object, default: {}, label: 'Links' },
    isActive: {
      type: Boolean,
      default: true,
      label: 'Is active',
    },
    deviceTokens: {
      type: [String],
      default: [],
      label: 'Device tokens',
    },
  },
  {
    timestamps: true,
  },
);
