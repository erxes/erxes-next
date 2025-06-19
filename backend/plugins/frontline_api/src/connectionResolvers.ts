import { IChannelDocument } from '@/inbox/@types/channels';
import { IMessageDocument } from '@/inbox/@types/conversationMessages';
import { IConversationDocument } from '@/inbox/@types/conversations';
import { IIntegrationDocument } from '@/inbox/@types/integrations';
import { IChannelModel, loadChannelClass } from '@/inbox/db/models/Channels';
import {
  IMessageModel,
  loadClass as loadMessageClass,
} from '@/inbox/db/models/ConversationMessages';
import {
  IConversationModel,
  loadClass as loadConversationClass,
} from '@/inbox/db/models/Conversations';
import { IFacebookAccountDocument } from '@/integrations/facebook/@types/accounts';
import { IFacebookCommentConversationDocument } from '@/integrations/facebook/@types/comment_conversations';
import { IFacebookCommentConversationReplyDocument } from '@/integrations/facebook/@types/comment_conversations_reply';
import { IFacebookConfigDocument } from '@/integrations/facebook/@types/config';
import { IFacebookConversationMessageDocument } from '@/integrations/facebook/@types/conversationMessages';
import { IFacebookConversationDocument } from '@/integrations/facebook/@types/conversations';
import { IFacebookCustomerDocument } from '@/integrations/facebook/@types/customers';
import { IFacebookIntegrationDocument } from '@/integrations/facebook/@types/integrations';
import { IFacebookLogDocument } from '@/integrations/facebook/@types/logs';
import { IFacebookPostConversationDocument } from '@/integrations/facebook/@types/postConversations';
import {
  IFacebookAccountModel,
  loadFacebookAccountClass,
} from '@/integrations/facebook/db/models/Accounts';
import {
  IFacebookCommentConversationModel,
  loadFacebookCommentConversationClass,
} from '@/integrations/facebook/db/models/Comment_conversations';
import {
  IFacebookCommentConversationReplyModel,
  loadFacebookCommentConversationReplyClass,
} from '@/integrations/facebook/db/models/Comment_conversations_reply';
import {
  IFacebookConfigModel,
  loadFacebookConfigClass,
} from '@/integrations/facebook/db/models/Config';
import {
  IFacebookConversationMessageModel,
  loadFacebookConversationMessageClass,
} from '@/integrations/facebook/db/models/ConversationMessages';
import {
  IFacebookConversationModel,
  loadFacebookConversationClass,
} from '@/integrations/facebook/db/models/Conversations';
import {
  IFacebookCustomerModel,
  loadFacebookCustomerClass,
} from '@/integrations/facebook/db/models/Customers';
import {
  IFacebookIntegrationModel,
  loadFacebookIntegrationClass,
} from '@/integrations/facebook/db/models/Integrations';
import {
  IFacebookLogModel,
  loadFacebookLogClass,
} from '@/integrations/facebook/db/models/Logs';
import {
  IFacebookPostConversationModel,
  loadFacebookPostConversationClass,
} from '@/integrations/facebook/db/models/PostConversations';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import {
  IIntegrationModel,
  loadClass as loadIntegrationClass,
} from '~/modules/inbox/db/models/Integrations';
import { IBoardModel } from '~/modules/tickets/db/models/Boards';
import {
  IChecklistItemModel,
  IChecklistModel,
} from '~/modules/tickets/db/models/Checklists';
import { ICommentModel } from '~/modules/tickets/db/models/Comments';
import { IPipelineLabelModel } from '~/modules/tickets/db/models/Labels';
import { IPipelineModel } from '~/modules/tickets/db/models/Pipelines';
import { IStageModel } from '~/modules/tickets/db/models/Stages';
import { ITicketModel } from '~/modules/tickets/db/models/Tickets';
import { loadClasses as loadTicketClasses } from '~/modules/tickets/resolver';

export interface IModels {
  Channels: IChannelModel;
  Integrations: IIntegrationModel;
  Conversations: IConversationModel;
  ConversationMessages: IMessageModel;
  FacebookIntegrations: IFacebookIntegrationModel;
  FacebookAccounts: IFacebookAccountModel;
  FacebookCustomers: IFacebookCustomerModel;
  FacebookConversations: IFacebookConversationModel;
  FacebookConversationMessages: IFacebookConversationMessageModel;
  FacebookCommentConversation: IFacebookCommentConversationModel;
  FacebookCommentConversationReply: IFacebookCommentConversationReplyModel;
  FacebookLogs: IFacebookLogModel;
  FacebookPostConversations: IFacebookPostConversationModel;
  FacebookConfigs: IFacebookConfigModel;

  Boards: IBoardModel;
  Pipelines: IPipelineModel;
  Stages: IStageModel;
  Tickets: ITicketModel;
  PipelineLabels: IPipelineLabelModel;
  CheckLists: IChecklistModel;
  CheckListItems: IChecklistItemModel;
  Comments: ICommentModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
  serverTiming: any;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;
  models.Channels = db.model<IChannelDocument, IChannelModel>(
    'channels',
    loadChannelClass(models),
  );
  models.Integrations = db.model<IIntegrationDocument, IIntegrationModel>(
    'integrations',
    loadIntegrationClass(models, subdomain),
  );
  models.Conversations = db.model<IConversationDocument, IConversationModel>(
    'conversations',
    loadConversationClass(models),
  );
  models.ConversationMessages = db.model<IMessageDocument, IMessageModel>(
    'conversation_messages',
    loadMessageClass(models),
  );
  models.FacebookAccounts = db.model<
    IFacebookAccountDocument,
    IFacebookAccountModel
  >('facebook_accounts', loadFacebookAccountClass(models));
  models.FacebookCustomers = db.model<
    IFacebookCustomerDocument,
    IFacebookCustomerModel
  >('customers_facebooks', loadFacebookCustomerClass(models));
  models.FacebookConversations = db.model<
    IFacebookConversationDocument,
    IFacebookConversationModel
  >('conversations_facebooks', loadFacebookConversationClass(models));
  models.FacebookConversationMessages = db.model<
    IFacebookConversationMessageDocument,
    IFacebookConversationMessageModel
  >(
    'conversation_messages_facebooks',
    loadFacebookConversationMessageClass(models),
  );

  models.FacebookCommentConversation = db.model<
    IFacebookCommentConversationDocument,
    IFacebookCommentConversationModel
  >(
    'comment_conversations_facebook',
    loadFacebookCommentConversationClass(models),
  );
  models.FacebookCommentConversationReply = db.model<
    IFacebookCommentConversationReplyDocument,
    IFacebookCommentConversationReplyModel
  >(
    'comment_conversations_reply_facebook',
    loadFacebookCommentConversationReplyClass(models),
  );
  models.FacebookIntegrations = db.model<
    IFacebookIntegrationDocument,
    IFacebookIntegrationModel
  >('facebook_integrations', loadFacebookIntegrationClass(models));
  models.FacebookLogs = db.model<IFacebookLogDocument, IFacebookLogModel>(
    'facebook_logs',
    loadFacebookLogClass(models),
  );
  models.FacebookPostConversations = db.model<
    IFacebookPostConversationDocument,
    IFacebookPostConversationModel
  >('posts_conversations_facebooks', loadFacebookPostConversationClass(models));
  models.FacebookConfigs = db.model<
    IFacebookConfigDocument,
    IFacebookConfigModel
  >('facebook_configs', loadFacebookConfigClass(models));

  loadTicketClasses(models, db);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
