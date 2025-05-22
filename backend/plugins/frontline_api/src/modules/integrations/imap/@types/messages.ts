import { Document } from 'mongoose';

interface IMapMail {
  name: string;
  address: string;
}
export interface IMapAttachmentParams {
  filename: string;
  size: number;
  mimeType: string;
  data?: string;
  attachmentId?: string;
}
export interface IMapMessage {
  inboxIntegrationId: string;
  inboxConversationId: string;
  messageId: string;
  subject: string;
  body: string;
  to: IMapMail[];
  cc: IMapMail[];
  bcc: IMapMail[];
  from: IMapMail[];
  attachments?: IMapAttachmentParams[];
  createdAt: Date;
}

export interface IMapMessageDocument extends IMapMessage, Document {}