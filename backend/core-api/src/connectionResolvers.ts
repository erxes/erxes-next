import {
  createGenerateModels,
  ICustomerDocument,
  IContext as IMainContext,
  ITagDocument,
} from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { ITagModel, loadTagClass } from './db/models/Tags';

export interface IModels {
  Customers: ICustomerModel;
  Tags: ITagModel;
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
    loadCustomerClass(models),
  );

  models.Tags = db.model<ITagDocument, ITagModel>(
    'tags', 
    loadTagClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
