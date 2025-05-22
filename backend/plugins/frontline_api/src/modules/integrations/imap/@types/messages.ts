import { Document } from 'mongoose';

interface IIMapMail {
  name: string;
  address: string;
}
export interface IIMapAttachmentParams {
  filename: string;
  size: number;
  mimeType: string;
  data?: string;
  attachmentId?: string;
}
export interface IIMapMessage {
  inboxIntegrationId: string;
  inboxConversationId: string;
  messageId: string;
  subject: string;
  body: string;
  to: IIMapMail[];
  cc: IIMapMail[];
  bcc: IIMapMail[];
  from: IIMapMail[];
  attachments?: IIMapAttachmentParams[];
  createdAt: Date;
}

export interface ISendMailArgs {
  integrationId: string;
  conversationId?: string;
  subject: string;
  body: string;
  from: string;
  customerId?: string;
  to: string[];
  attachments?: IIMapAttachmentParams[];
  replyToMessageId?: string;
  shouldOpen?: boolean;
  shouldResolve?: boolean;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface IIMapMessageDocument extends IIMapMessage, Document {}