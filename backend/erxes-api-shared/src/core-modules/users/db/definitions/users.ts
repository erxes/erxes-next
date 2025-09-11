import { Schema } from 'mongoose';

import { customFieldSchema } from '../../../common/db/definitions/common';
import { USER_MOVEMENT_STATUSES, USER_ROLES } from '../../constants';

enum IUserChatStatus {
  online = 'online',
  offline = 'offline',
}

// Mongoose schemas ===============================
const emailSignatureSchema = new Schema(
  {
    brandId: { type: String, label: 'Email signature brand' },
    signature: { type: String, label: 'Email signature' },
  },
  { _id: false },
);

// Detail schema
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

// User schema
export const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    label: 'Created at',
  },
  username: { type: String, label: 'Username' },
  password: { type: String, optional: true },
  resetPasswordToken: { type: String },
  registrationToken: { type: String },
  registrationTokenExpires: { type: Date },
  resetPasswordExpires: { type: Date },
  isOwner: { type: Boolean, label: 'Is owner' },
  departmentIds: { type: [String], label: 'Department Ids' },
  branchIds: { type: [String], label: 'Branch Ids' },
  positionIds: { type: [String], label: 'Position Ids' },
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
  getNotificationByEmail: {
    type: Boolean,
    label: 'Get notification by email',
  },
  emailSignatures: {
    type: [emailSignatureSchema],
    label: 'Email signatures',
  },
  starredConversationIds: {
    type: [String],
    label: 'Starred conversations',
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
  brandIds: { type: [String], label: 'Brands' },
  groupIds: { type: [String], label: 'Groups' },
  deviceTokens: {
    type: [String],
    default: [],
    label: 'Device tokens',
  },
  code: { type: String },
  doNotDisturb: {
    type: String,
    optional: true,
    default: 'No',
    label: 'Do not disturb',
  },
  isSubscribed: {
    type: String,
    optional: true,
    default: 'Yes',
    label: 'Subscribed',
  },
  isShowNotification: {
    type: Boolean,
    optional: true,
    default: false,
    label: 'Check if user shows',
  },
  score: {
    type: Number,
    optional: true,
    label: 'Score',
    esType: 'number',
    default: 0,
  },

  role: {
    type: String,
    label: 'User role',
    optional: true,
    default: USER_ROLES.USER,
    enum: USER_ROLES.ALL,
  },
  appId: {
    type: String,
    label: 'Linked app id',
    optional: true,
  },
  employeeId: {
    type: String,
    unique: true,
    optional: true,
    sparse: true,
  },
  chatStatus: {
    type: String,
    enum: Object.values(IUserChatStatus),
    optional: true,
    label: 'User chat status /used for exm/',
  },
  customFieldsData: {
    type: [customFieldSchema],
    optional: true,
    label: 'Custom fields data',
  },
});

export const userMovemmentSchema = new Schema({
  contentType: { type: String, label: 'Content Type' },
  contentTypeId: { type: String, label: 'Content Type Id' },
  userId: { type: String, label: 'User Id' },
  createdBy: { type: String, label: 'Created By' },
  isActive: { type: Boolean, label: 'Is Active' },
  status: {
    type: String,
    label: 'User Movement Status',
    default: USER_MOVEMENT_STATUSES.CREATED,
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    default: Date.now,
  },
});
