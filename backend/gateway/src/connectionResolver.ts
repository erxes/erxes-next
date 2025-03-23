import * as mongoose from 'mongoose';
import { createGenerateModels } from 'erxes-api-utils';
import { userSchema } from 'erxes-api-modules/modules/users/db/definitions/users';
import { permissionSchema } from 'erxes-api-modules/modules/permissions/db/definitions/permissions';
import { appSchema } from 'erxes-api-modules/modules/apps/db/definitions/apps';
import { IUserDocument } from 'erxes-api-modules';

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
