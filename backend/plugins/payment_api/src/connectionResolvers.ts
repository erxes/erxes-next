import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IPaymentDocument } from '@/payment/@types/payment';

import mongoose from 'mongoose';

import { loadPaymentClass, IPaymentModel } from '@/payment/db/models/payment';
import {
  IInvoiceModel,
  loadInvoiceClass,
} from '~/modules/payment/db/models/Invoices';
import {
  ITransactionModel,
  loadTransactionClass,
} from '~/modules/payment/db/models/Transactions';
import { IInvoiceDocument } from '~/modules/payment/@types/invoices';
import { ITransactionDocument } from '~/modules/payment/@types/transactions';

export interface IModels {
  PaymentMethods: IPaymentModel;
  Invoices: IInvoiceModel;
  Transactions: ITransactionModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.PaymentMethods = db.model<IPaymentDocument, IPaymentModel>(
    'payment_methods',
    loadPaymentClass(models),
  );

  models.Invoices = db.model<IInvoiceDocument, IInvoiceModel>(
    'payment_invoices',
    loadInvoiceClass(models),
  );

  models.Transactions = db.model<ITransactionDocument, ITransactionModel>(
    'payment_transactions',
    loadTransactionClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
