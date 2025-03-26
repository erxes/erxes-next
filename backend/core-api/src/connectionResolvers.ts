import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import {
  ICustomerModel,
  loadCustomerClass,
} from './modules/contacts/db/models/Customers';
import { ICustomerDocument } from './modules/contacts/@types/customers';
import { IUserMovementDocument } from './modules/contacts/@types/user';
import { IUserDocument } from 'erxes-api-modules';
import {
  IUserModel,
  loadUserClass,
  IUserMovemmentModel,
  loadUserMovemmentClass,
} from './modules/organization/team-member/db/models/Users';

export interface IModels {
  Customers: ICustomerModel;
  Users: IUserModel;
  UserMovements: IUserMovemmentModel;
}

export interface IContext {
  subdomain: string;
  models: IModels;
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
  models.UserMovements = db.model<IUserMovementDocument, IUserMovemmentModel>(
    'user_movements',
    loadUserMovemmentClass(models)
  );


  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
