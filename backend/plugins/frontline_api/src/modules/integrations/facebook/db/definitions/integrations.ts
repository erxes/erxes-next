import { Schema } from 'mongoose';

export const integrationSchema = new Schema({
  kind: String,
  accountId: String,
  erxesApiId: String,
  emailScope: String,
  facebookPageIds: {
    type: [String],
    label: 'Facebook page ids',
    optional: true,
  },
  email: String,
  expiration: String,
  facebookPageTokensMap: {
    type: Object,
    default: {},
  },
  healthStatus: String,
  error: String,
});
