import { Document } from 'mongoose';

export interface IAttachmentParams {
  data: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface IEmailDeliveries {
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: IAttachmentParams[];
  from: string;
  kind: string;
  userId?: string;
  customerId?: string;
  status?: string;
}

export interface IEmailDeliveriesDocument extends IEmailDeliveries, Document {
  id: string;
}

export interface IEmailParams {
  toEmails?: string[];
  fromEmail?: string;
  title?: string;
  customHtml?: string;
  customHtmlData?: any;
  template?: { name?: string; data?: any };
  attachments?: object[];
  modifier?: (data: any, email: string) => void;
  transportMethod?: string;
  getOrganizationDetail?: ({ subdomain }: { subdomain: string }) => any;
}
