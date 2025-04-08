import * as mongoose from 'mongoose';
import { createGenerateModels } from 'erxes-api-utils';
import { userSchema } from 'erxes-core-modules';
import { permissionSchema } from 'erxes-core-modules';
import { appSchema } from 'erxes-core-modules';
import { IUserDocument } from 'erxes-core-types';
export interface IMainContext {
  res: any;
  requestInfo: any;
  user: IUserDocument;
  docModifier: <T>(doc: T) => any;
}

export interface IModels {
  Users: any;
  Permissions: any;
  Apps: any;
  Clients: any;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Users = db.model('users', userSchema);
  models.Permissions = db.model('permissions', permissionSchema);
  models.Apps = db.model('apps', appSchema);
  models.Clients = db.model('clients', appSchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
