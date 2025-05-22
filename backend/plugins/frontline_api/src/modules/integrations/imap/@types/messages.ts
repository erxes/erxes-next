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

export interface ImapSendMailInput {
  to: string | string[];
  subject: string;
  body:string;
  text: string;
  html?: string;
  from?: string;
  conversationId?: string;
  integrationId?: string;
  customerId?: string;
  attachments?: Array<{name: string; url: string; type?: string; size?: number}>;
  replyToMessageId?: string;
  shouldOpen?: boolean;
  shouldResolve?: boolean;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface IIMapMessageDocument extends IIMapMessage, Document {}