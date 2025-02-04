import * as mongoose from 'mongoose';
import { createGenerateModels } from 'erxes-api-utils';

export interface IModels {
  Users: any;
  Permissions: any;
  Apps: any;
}

export interface IContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;
  console.log(db);
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
