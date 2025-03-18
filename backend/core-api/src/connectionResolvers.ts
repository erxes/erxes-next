import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { ICustomerDocument } from './modules/contacts/customers/@types';
import { IContext as IMainContext } from './modules/@types/common';
import {
  IFieldDocument,
  IFieldGroupDocument,
} from './modules/properties/@types';
import { IFieldModel, loadFieldClass } from './db/models/properties/Field';
import {
  IFieldGroupModel,
  loadGroupClass,
} from './db/models/properties/FieldGroup';

export interface IModels {
  Customers: ICustomerModel;
  Fields: IFieldModel;
  FieldsGroups: IFieldGroupModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models),
  );

  models.Fields = db.model<IFieldDocument, IFieldModel>(
    'form_fields',
    loadFieldClass(models),
  );

  models.FieldsGroups = db.model<IFieldGroupDocument, IFieldGroupModel>(
    'fields_groups',
    loadGroupClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
