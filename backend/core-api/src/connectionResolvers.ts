import { IUserDocument } from 'erxes-api-modules';
import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICompanyDocument } from './modules/contacts/@types/company';
import { ICustomerDocument } from './modules/contacts/@types/customers';
import { IUserMovementDocument } from './modules/contacts/@types/user';
import {
  ICompanyModel,
  loadCompanyClass,
} from './modules/contacts/db/models/Companies';
import {
  ICustomerModel,
  loadCustomerClass,
} from './modules/contacts/db/models/Customers';
import {
  IUserModel,
  IUserMovemmentModel,
  loadUserClass,
  loadUserMovemmentClass,
} from './modules/organization/team-member/db/models/Users';
import { IConfigDocument } from './modules/settings/db/definitions/configs';
import { IConfigModel } from './modules/settings/db/models/Configs';
import { ITagDocument } from './modules/tags/@types';
import { ITagModel, loadTagClass } from './modules/tags/db/models/Tags';

export interface IModels {
  Customers: ICustomerModel;
  Companies: ICompanyModel;
  Users: IUserModel;
  UserMovements: IUserMovemmentModel;
  Configs: IConfigModel;
  Tags: ITagModel;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Users = db.model<IUserDocument, IUserModel>(
    'users',
    loadUserClass(models),
  );

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models),
  );

  models.Companies = db.model<ICompanyDocument, ICompanyModel>(
    'companies',
    loadCompanyClass(models),
  );

  models.UserMovements = db.model<IUserMovementDocument, IUserMovemmentModel>(
    'user_movements',
    loadUserMovemmentClass(models),
  );

  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'configs',
    loadUserMovemmentClass(models),
  );

  models.Tags = db.model<ITagDocument, ITagModel>('tags', loadTagClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
