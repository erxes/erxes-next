import { Document, Schema } from 'mongoose';
import { field, USER_ROLES } from 'erxes-api-utils';

interface IEmailSignature {
  brandId?: string;
  signature?: string;
}

interface IEmailSignatureDocument extends IEmailSignature, Document {}

interface IDetail {
  avatar?: string;
  coverPhoto?: string;
  fullName?: string;
  shortName?: string;
  position?: string;
  birthDate?: Date;
  workStartedDate?: Date;
  location?: string;
  description?: string;
  operatorPhone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

interface IDetailDocument extends IDetail, Document {}

interface IUser {
  createdAt?: Date;
  username?: string;
  password: string;
  resetPasswordToken?: string;
  registrationToken?: string;
  registrationTokenExpires?: Date;
  isOwner?: boolean;
  email?: string;
  getNotificationByEmail?: boolean;
  emailSignatures?: IEmailSignature[];
  starredConversationIds?: string[];
  details?: IDetail;
  isActive?: boolean;
  brandIds?: string[];
  groupIds?: string[];
  deviceTokens?: string[];
  code?: string;
  doNotDisturb?: string;
  isSubscribed?: string;
  sessionCode?: string;
  isShowNotification?: boolean;
  score?: number;
  departmentIds?: string[];
  branchIds?: string[];
  positionIds?: string[];
  employeeId?: string;
  chatStatus?: IUserChatStatus;
}

enum IUserChatStatus {
  online = 'online',
  offline = 'offline',
}

interface IUserDocument extends IUser, Document {
  _id: string;
  emailSignatures?: IEmailSignatureDocument[];
  details?: IDetailDocument;
  role?: string;
  appId?: string;
}

// Mongoose schemas ===============================
const emailSignatureSchema = new Schema(
  {
    brandId: field({ type: String, label: 'Email signature nrand' }),
    signature: field({ type: String, label: 'Email signature' }),
  },
  { _id: false },
);

// Detail schema
const detailSchema = new Schema(
  {
    avatar: field({ type: String, label: 'Avatar' }),
    coverPhoto: field({ type: String, label: 'Cover photo' }),
    shortName: field({ type: String, optional: true, label: 'Short name' }),
    fullName: field({ type: String, label: 'Full name' }),
    birthDate: field({ type: Date, label: 'Birth date' }),
    workStartedDate: field({ type: Date, label: 'Date to joined to work' }),
    position: field({ type: String, label: 'Position' }),
    location: field({ type: String, optional: true, label: 'Location' }),
    description: field({ type: String, optional: true, label: 'Description' }),
    operatorPhone: field({
      type: String,
      optional: true,
      label: 'Operator phone',
    }),
    firstName: field({ type: String, label: 'First name' }),
    middleName: field({ type: String, label: 'Middle name' }),
    lastName: field({ type: String, label: 'Last name' }),
  },
  { _id: false },
);

// User schema
const userSchema = new Schema({
  _id: field({ pkey: true }),
  username: field({ type: String, label: 'Username' }),
  password: field({ type: String, optional: true }),
  resetPasswordToken: field({ type: String }),
  registrationToken: field({ type: String }),
  registrationTokenExpires: field({ type: Date }),
  resetPasswordExpires: field({ type: Date }),
  isOwner: field({ type: Boolean, label: 'Is owner' }),
  departmentIds: field({ type: [String], label: 'Department Ids' }),
  branchIds: field({ type: [String], label: 'Branch Ids' }),
  positionIds: field({ type: [String], label: 'Position Ids' }),
  email: {
    type: String,
    unique: true,
    sparse: true, // Optional: Allows multiple null values
    required: [true, 'Email is required'],
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: (props: { value: string }) =>
        `${props.value} is not a valid email address`,
    },
    set: (value: string) => value.toLowerCase(), // Normalize to lowercase
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  getNotificationByEmail: field({
    type: Boolean,
    label: 'Get notification by email',
  }),
  emailSignatures: field({
    type: [emailSignatureSchema],
    label: 'Email signatures',
  }),
  starredConversationIds: field({
    type: [String],
    label: 'Starred conversations',
  }),
  details: field({ type: detailSchema, default: {}, label: 'Details' }),
  links: field({ type: Object, default: {}, label: 'Links' }),
  isActive: field({ type: Boolean, default: true, label: 'Is active' }),
  brandIds: field({ type: [String], label: 'Brands' }),
  groupIds: field({ type: [String], label: 'Groups' }),
  deviceTokens: field({
    type: [String],
    default: [],
    label: 'Device tokens',
  }),
  code: field({ type: String }),
  doNotDisturb: field({
    type: String,
    optional: true,
    default: 'No',
    label: 'Do not disturb',
  }),

  isSubscribed: field({
    type: String,
    optional: true,
    default: 'Yes',
    label: 'Subscribed',
  }),

  role: field({
    type: String,
    label: 'User role',
    optional: true,
    default: USER_ROLES.USER,
    enum: USER_ROLES.ALL,
  }),
});

interface IUserMovementDocument extends Document {
  _id: string;
  contentType: string;
  contentTypeId: string;
  userId: string;
  createdAt: string;
  createdBy: string;
  status: string;
  isActive: boolean;
}

export {
  IDetail,
  IDetailDocument,
  IEmailSignature,
  IEmailSignatureDocument,
  IUser,
  IUserDocument,
  userSchema,
  IUserMovementDocument,
};
