import { Document, Schema } from 'mongoose';
import { schemaHooksWrapper } from '~/modules/integrations/call/db/utils';

export interface IGoogleCredentials {
  access_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface IKnowledgebaseCredentials {
  integrationId: string;
  topicId: string;
}

export interface ILeadCredentials {
  integrationId: string;
  formCode: string;
}

export interface IWebsiteCredentials {
  integrationId: string;
  description?: string;
  buttonText: string;
  url: string;
}

export type IMessengerAppCrendentials =
  | IGoogleCredentials
  | IKnowledgebaseCredentials
  | ILeadCredentials
  | IWebsiteCredentials;

export interface IMessengerApp {
  kind: 'googleMeet' | 'knowledgebase' | 'lead' | 'website';
  name: string;
  accountId?: string;
  showInInbox?: boolean;
  credentials?: IMessengerAppCrendentials;
}

export interface IMessengerAppDocument extends IMessengerApp, Document {
  _id: string;
}

// Messenger apps ===============
export const messengerAppSchema = schemaHooksWrapper(
  new Schema({
    _id: { pkey: true },

    kind: {
      type: String,
      enum: ['googleMeet', 'knowledgebase', 'lead', 'website'],
    },

    name: { type: String },
    accountId: { type: String, optional: true },
    showInInbox: { type: Boolean, default: false },
    credentials: { type: Object },
  }),
  'erxes_messenger_apps',
);

messengerAppSchema.index({ kind: 1, 'credentials.integrationId': 1 });
