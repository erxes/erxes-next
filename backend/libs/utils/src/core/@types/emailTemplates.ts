import { Document } from 'mongoose';

export interface IEmailTemplate {
  name: string;
  content: string;
  status?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  createdBy?: string;
  scopeBrandIds?: string[];
}

export interface IEmailTemplateDocument extends IEmailTemplate, Document {
  _id: string;
}
