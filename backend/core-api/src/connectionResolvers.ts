import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { ICustomerDocument } from './modules/contacts/customers/@types';

export interface IModels {
  Customers: ICustomerModel;
}

export interface IContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
