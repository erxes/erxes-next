import {
  createGenerateModels,
  ICustomerDocument,
  IContext as IMainContext,
} from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';

export interface IModels {
  Customers: ICustomerModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models, subdomain),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
