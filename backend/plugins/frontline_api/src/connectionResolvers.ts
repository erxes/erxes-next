import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';
import { IChannelDocument } from '@/inbox/@types/channels';
import { IIntegrationDocument } from '@/inbox/@types/integrations';
import { IChannelModel, loadChannelClass } from '@/inbox/db/models/Channels';
import {
  IIntegrationModel,
  loadClass as loadIntegrationClass,
} from '~/modules/inbox/db/models/Integrations';
export interface IModels {
  Integrations: IIntegrationModel;
  Channels: IChannelModel;
}

export interface IContext extends IMainContext {
  docModifier: <T>(doc: T) => any;
  models: IModels;
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
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
