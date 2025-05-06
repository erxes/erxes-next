import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';
import { IChannelDocument } from '@/inbox/@types/channels';
import { IIntegrationDocument } from '@/inbox/@types/integrations';
import { IConversationDocument } from '@/inbox/@types/conversations';
import { IFacebookIntegrationDocument } from '@/integrations/facebook/@types/integrations';
import { IFacebookLogDocument } from '@/integrations/facebook/@types/logs';
import { IFacebookAccountDocument } from '@/integrations/facebook/@types/accounts';
import { IFacebookCustomerDocument } from '@/integrations/facebook/@types/customers';
import { IFacebookConversationDocument } from '@/integrations/facebook/@types/conversations';
import { IFacebookConversationMessageDocument } from '@/integrations/facebook/@types/conversationMessages'
import { IFacebookCommentConversationDocument } from '@/integrations/facebook/@types/comment_conversations'
import { IFacebookCommentConversationReplyDocument } from '@/integrations/facebook/@types/comment_conversations_reply'
import { IFacebookPostConversationDocument } from '@/integrations/facebook/@types/postConversations'
import { IFacebookConfigDocument } from '@/integrations/facebook/@types/config'
import { IChannelModel, loadChannelClass } from '@/inbox/db/models/Channels';
import {
  IIntegrationModel,
  loadClass as loadIntegrationClass,
} from '~/modules/inbox/db/models/Integrations';
import {
  IConversationModel,
  loadClass as loadConversationClass,
} from '~/modules/inbox/db/models/Conversations';
import { IFacebookIntegrationModel, loadFacebookIntegrationClass } from '@/integrations/facebook/db/models/Integrations';
import { IFacebookAccountModel, loadFacebookAccountClass } from '@/integrations/facebook/db/models/Accounts';
import { IFacebookCustomerModel, loadFacebookCustomerClass } from '@/integrations/facebook/db/models/Customers';
import { IFacebookConversationModel, loadFacebookConversationClass } from '@/integrations/facebook/db/models/Conversations';
import { IFacebookConversationMessageModel, loadFacebookConversationMessageClass } from '@/integrations/facebook/db/models/ConversationMessages';
import { IFacebookCommentConversationModel, loadFacebookCommentConversationClass } from '@/integrations/facebook/db/models/Comment_conversations';
import { IFacebookCommentConversationReplyModel, loadFacebookCommentConversationReplyClass } from '@/integrations/facebook/db/models/Comment_conversations_reply';
import { IFacebookLogModel, loadFacebookLogClass } from '@/integrations/facebook/db/models/Logs';
import { IFacebookPostConversationModel, loadFacebookPostConversationClass } from '@/integrations/facebook/db/models/PostConversations';
import { IFacebookConfigModel, loadFacebookConfigClass } from '@/integrations/facebook/db/models/Config';

export interface IModels {
  Channels: IChannelModel;
  Integrations: IIntegrationModel;
  Conversations: IConversationModel;
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
    loadConversationClass(models, subdomain),
  );
  models.FacebookAccounts = db.model<IFacebookAccountDocument, IFacebookAccountModel>(
    'facebook_accounts',
    loadFacebookAccountClass(models),
  );
  models.FacebookCustomers = db.model<IFacebookCustomerDocument, IFacebookCustomerModel>(
    'customers_facebooks',
    loadFacebookCustomerClass(models),
  );
    models.FacebookConversations = db.model<IFacebookConversationDocument, IFacebookConversationModel>(
    'conversations_facebooks',
    loadFacebookConversationClass(models)
  );
    models.FacebookConversationMessages = db.model<
    IFacebookConversationMessageDocument,
    IFacebookConversationMessageModel
  >('conversation_messages_facebooks', loadFacebookConversationMessageClass(models));
  
    models.FacebookCommentConversation = db.model<
    IFacebookCommentConversationDocument,
    IFacebookCommentConversationModel
  >('comment_conversations_facebook', loadFacebookCommentConversationClass(models));
  models.FacebookCommentConversationReply = db.model<
    IFacebookCommentConversationReplyDocument,
    IFacebookCommentConversationReplyModel
  >(
    'comment_conversations_reply_facebook',
    loadFacebookCommentConversationReplyClass(models)
  );
  models.FacebookIntegrations = db.model<IFacebookIntegrationDocument, IFacebookIntegrationModel>(
    'facebook_integrations',
    loadFacebookIntegrationClass(models)
  );
  models.FacebookLogs = db.model<IFacebookLogDocument, IFacebookLogModel>(
    'facebook_logs',
    loadFacebookLogClass(models)
  );
  models.FacebookPostConversations = db.model<
    IFacebookPostConversationDocument,
    IFacebookPostConversationModel
  >('posts_conversations_facebooks', loadFacebookPostConversationClass(models));
  models.FacebookConfigs = db.model<IFacebookConfigDocument, IFacebookConfigModel>(
    'facebook_configs',
    loadFacebookConfigClass(models)
  );
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
