import { IAttachment } from 'erxes-ui';

export interface ICallConfig {
  _id: string;
  inboxId: string;
  phone: string;
  wsServer: string;
  operators: { userId: string; gsUsername: string; gsPassword: string }[];
  token: string;
  queues: string[];
}
export interface ICallConfigDoc extends ICallConfig {
  isAvailable: boolean;
}

export interface ICallConversationNote {
  _id: string;
  content: string;
  createdAt: string;
  attachments: IAttachment[];
  customerId?: string;
  userId?: string;
  internal?: boolean;
}
