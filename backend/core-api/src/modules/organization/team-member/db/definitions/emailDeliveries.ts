import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { EMAIL_DELIVERY_STATUS } from '~/modules/organization/team-member/constants';

export const emailDeliveriesSchema = new Schema({
  _id: mongooseStringRandomId,
  subject: { type: String },
  body: { type: String },
  to: { type: [String] },
  cc: { type: [String], optional: true },
  bcc: { type: [String], optional: true },
  attachments: { type: [Object] },
  from: { type: String },
  kind: { type: String },
  customerId: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: EMAIL_DELIVERY_STATUS.ALL },
});
