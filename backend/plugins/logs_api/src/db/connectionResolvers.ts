import { createGenerateModels, getEnv } from 'erxes-api-utils';
import { ICustomerDocument, IMainContext } from 'erxes-core-types';
import mongoose from 'mongoose';

import { ILogModel, loadLogsClass } from './models/Logs';
import { ILogDocument } from './definitions/logs';

export interface IModels {
  Logs: ILogModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  const db_name = db.name;

  const logDb = db.useDb(`${db_name}_logs`);

  models.Logs = logDb.model<ILogDocument, ILogModel>(
    'logs',
    loadLogsClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
