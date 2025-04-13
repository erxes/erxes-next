import { createGenerateModels } from 'erxes-api-shared/utils';
import { ICustomerDocument, IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';

import {
  ICustomerModel,
  loadCustomerClass,
} from './modules/inbox/db/models/Customers';

export interface IModels {
  Customers: ICustomerModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'frontline',
    loadCustomerClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
