import { Schema } from 'mongoose';

export const customerSchema = new Schema({
  userId: { type: String, unique: true, label: 'Facebook user id' },
  erxesApiId: { type: String, label: 'Customer id at contacts-api' },
  firstName: String,
  lastName: String,
  profilePic: String,
  integrationId: { type: String, label: 'Inbox integration id' },
});
