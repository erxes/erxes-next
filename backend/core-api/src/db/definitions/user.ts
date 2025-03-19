import { USER_MOVEMENT_STATUSES, stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';
export const userMovemmentSchema = new Schema({
  _id: stringRandomId,
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
  createdAt: { type: Date, label: 'Created At', default: Date.now },
});
