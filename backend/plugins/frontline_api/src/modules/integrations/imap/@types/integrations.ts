import { Document } from 'mongoose';
export interface IIMapIntegration {
  inboxId: string;
  host: string;
  smtpHost: string;
  smtpPort: string;
  mainUser: string;
  user: string;
  password: string;
  healthStatus?: string;
  error?: string;
  lastFetchDate?: Date;
}

export interface IIMapIntegrationDocument extends IIMapIntegration, Document {}