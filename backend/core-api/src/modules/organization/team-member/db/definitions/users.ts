import { Schema } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, label: 'First name', optional: true },
  lastName: { type: String, label: 'Last name', optional: true },
  middleName: { type: String, label: 'Middle name', optional: true },
  avatar: { type: String, optional: true, label: 'Avatar' },
  primaryEmail: {
    type: String,
    label: 'Primary Email',
    optional: true,
    esType: 'email',
  },
  emails: { type: [String], optional: true, label: 'Emails' },
  createdAt: { type: Date, label: 'Created at', esType: 'date' },
  modifiedAt: { type: Date, label: 'Modified at', esType: 'date' },
});

export default userSchema;
