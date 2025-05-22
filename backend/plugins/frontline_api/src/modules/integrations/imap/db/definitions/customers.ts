
import { Schema } from 'mongoose';
export const customerSchema = new Schema({
  inboxIntegrationId:  { type: String, required: true },
  contactsId:{ type: String},
  email: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
});
