import { Schema } from 'mongoose';
export const integrationSchema = new Schema({
  inboxId: String,
  host: String,
  smtpHost: String,
  smtpPort: String,
  mainUser: String,
  user: String,
  password: String,
  healthStatus: String,
  error: String,
  lastFetchDate: Date
});
