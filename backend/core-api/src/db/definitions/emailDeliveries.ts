import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';
export const EMAIL_DELIVERY_STATUS = {
  PENDING: 'pending',
  RECEIVED: 'received',
  ALL: ['pending', 'received'],
};

export const emailDeliveriesSchema = new Schema({
  _id: stringRandomId,
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
  status: {
    type: String,
    enum: EMAIL_DELIVERY_STATUS.ALL,
  },
});
