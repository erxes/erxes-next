import mongoose from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  IConfigModel,
  loadConfigClass,
} from '~/modules/config/db/models/Config';
import { IConfigDocument } from '~/modules/config/types';

export interface IConfigModels {
  Configs: IConfigModel;
}

export const loadClass = (models: IModels, db: mongoose.Connection) => {
  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'finance_configs',
    loadConfigClass(models),
  );
};
