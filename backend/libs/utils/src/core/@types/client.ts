import { Document } from 'mongoose';

export interface IClient {
  name: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  whiteListedIps: string[];
}

export interface IClientDocument extends IClient, Document {
  _id: string;
  createdAt: Date;
}
