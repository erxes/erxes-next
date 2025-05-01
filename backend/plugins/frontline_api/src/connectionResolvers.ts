import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';
import { IChannelDocument } from '@/inbox/@types/channels';
import { IIntegrationDocument } from '@/inbox/@types/integrations';
import { IConversationDocument } from '@/inbox/@types/conversations';
import { IFacebookAccountDocument } from '@/integrations/facebook/@types/accounts';
import { IChannelModel, loadChannelClass } from '@/inbox/db/models/Channels';
import {
  IIntegrationModel,
  loadClass as loadIntegrationClass,
} from '~/modules/inbox/db/models/Integrations';
import {
  IConversationModel,
  loadClass as loadConversationClass,
} from '~/modules/inbox/db/models/Conversations';
import { IFacebookAccountModel, loadFacebookAccountClass } from '@/integrations/facebook/db/models/Accounts';


export interface IModels {
  Channels: IChannelModel;
  Integrations: IIntegrationModel;
  Conversations: IConversationModel;
  FacebookAccounts: IFacebookAccountModel;
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
    loadFacebookAccountClass(models)
  );
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
