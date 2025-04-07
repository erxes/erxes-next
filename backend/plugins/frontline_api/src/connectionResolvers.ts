import { createGenerateModels } from 'erxes-api-utils';
import { ICustomerDocument, IMainContext } from 'erxes-core-types';
import mongoose from 'mongoose';

import {
  ICustomerModel,
  loadCustomerClass,
} from './modules/contacts/db/models/Customers';

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
