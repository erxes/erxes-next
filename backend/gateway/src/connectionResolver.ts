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

export const loadClasses = (
  _db: mongoose.Connection,
  _subdomain: string,
): IModels => {
  const models = {} as IModels;

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
