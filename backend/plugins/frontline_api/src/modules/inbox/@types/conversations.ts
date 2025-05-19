import { Document } from 'mongoose';
import { ICustomField } from 'erxes-api-shared/core-types';
import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';

export interface IConversation  extends IListParams, ICursorPaginateParams {
  skillId?: string;
  operatorStatus?: string;
  content?: string;
  integrationId: string;
  customerId?: string;
  visitorId?: string;
  userId?: string;
  assignedUserId?: string;
  participatedUserIds?: string[];
  userRelevance?: string;
  readUserIds?: string[];

  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
  closedUserId?: string;

  status?: string;
  messageCount?: number;
  tagIds?: string[];

  // number of total conversations
  number?: number;

  firstRespondedUserId?: string;
  firstRespondedDate?: Date;

  isCustomerRespondedLast?: boolean;
  customFieldsData?: ICustomField[];
  isBot?: boolean;
  botId?: string;
}

// Conversation schema
export interface IConversationDocument extends IConversation, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
