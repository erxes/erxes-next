import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { ICustomerDocument } from './modules/contacts/customers/@types';
import {
  IFormSubmissionModel,
  loadFormSubmissionClass,
} from './db/models/form/submission';
import { IFormModel, loadFormClass } from './db/models/form/form';
import { IForm, IFormSubmissionDocument } from './modules/form/types';
import { IContext as IMainContext } from './modules/@types/common';

export interface IModels {
  Customers: ICustomerModel;
  Forms: IFormModel;
  FormSubmissions: IFormSubmissionModel;
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

  models.Forms = db.model<IForm, IFormModel>('forms', loadFormClass(models));

  models.FormSubmissions = db.model<
    IFormSubmissionDocument,
    IFormSubmissionModel
  >('form_submissions', loadFormSubmissionClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
