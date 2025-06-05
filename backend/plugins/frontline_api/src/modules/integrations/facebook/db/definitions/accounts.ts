import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const accountSchema = new Schema({
  _id: mongooseStringRandomId,
  kind: { type: String },
  token: {
    type: String,
  },
  tokenSecret: {
    type: String,
    optional: true,
  },
  scope: {
    type: String,
    optional: true,
  },
  expireDate: {
    type: String,
    optional: true,
  },
  name: { type: String },
  uid: { type: String },
});
