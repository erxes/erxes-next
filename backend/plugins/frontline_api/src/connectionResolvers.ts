import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';
import { IChannelDocument } from '@/inbox/@types/channels';
import { IIntegrationDocument } from '@/inbox/@types/integrations';
import { IConversationDocument } from '@/inbox/@types/conversations';
import { IChannelModel, loadChannelClass } from '@/inbox/db/models/Channels';
import {
  IIntegrationModel,
  loadClass as loadIntegrationClass,
} from '~/modules/inbox/db/models/Integrations';
import {
  IConversationModel,
  loadClass as loadConversationClass,
} from '~/modules/inbox/db/models/Conversations';
export interface IModels {
  Integrations: IIntegrationModel;
  Conversations: IConversationModel;
  Channels: IChannelModel;
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
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
