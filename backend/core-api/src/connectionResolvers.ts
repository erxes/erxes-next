import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { ICustomerDocument } from './modules/contacts/customers/@types/customers';
import { IInternalNoteDocument } from './modules/internalNote/@types';
import {
  IInternalNoteModel,
  loadInternalNoteClass,
} from './db/models/InternalNote';
import { IContext as IMainContext } from './modules/@types/common';

export interface IModels {
  Customers: ICustomerModel;
  InternalNotes: IInternalNoteModel;
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

  models.InternalNotes = db.model<IInternalNoteDocument, IInternalNoteModel>(
    'internal_notes',
    loadInternalNoteClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
