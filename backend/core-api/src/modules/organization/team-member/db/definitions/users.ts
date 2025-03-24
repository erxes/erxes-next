import { Schema } from 'mongoose';
import { mongoStringRandomId } from 'erxes-api-utils';

const userSchema = new Schema({
  _id: mongoStringRandomId,
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
