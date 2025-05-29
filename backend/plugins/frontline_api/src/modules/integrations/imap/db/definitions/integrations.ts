import { Schema } from 'mongoose';
export const integrationSchema = new Schema({
 inboxId: { type: String, required: true },
  host: { type: String, required: true },
  smtpHost: { type: String, required: true },
  smtpPort: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d+$/.test(v) && parseInt(v) > 0 && parseInt(v) <= 65535,
      message: 'smtpPort must be a valid port number'
    }
  },
  mainUser: { type: String, required: true },
  user: { type: String, required: true },
  password: { type: String, required: true },
  healthStatus: String,
  error: String,
  lastFetchDate: Date,
});
