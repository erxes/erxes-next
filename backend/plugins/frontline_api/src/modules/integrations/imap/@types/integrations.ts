export interface IMapIntegration {
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

export interface IMapIntegrationDocument extends IMapIntegration, Document {}