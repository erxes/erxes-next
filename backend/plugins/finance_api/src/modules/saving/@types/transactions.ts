import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { Document } from 'mongoose';

export interface ITransaction {
  number?: string;
  contractId?: string;
  customerId?: string;
  companyId?: string;
  transactionType: string;
  description?: string;
  payDate: Date;
  payment?: number;
  currency?: string;
  storedInterest?: number;
  total: number;
  balance?: number;
  contractReaction?: any;
  storeReaction?: any;
  isManual?: boolean;
  dealtType?: 'internal' | 'external';
  dealtResponse?: any;
  accountNumber?: string;
  accountHolderName?: string;
  externalBankName?: string;
  ownBankNumber?: string;
  ownBankType?: string;
}

export interface ITransactionDocument extends ITransaction, Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
}

export interface IContractResult {
  contractId: string;
  invoiceId: string;
  customerId: string;
  companyId: string;
}

export interface ITransactionQueryParams
  extends IListParams,
    ICursorPaginateParams {
  contractId: string;
  customerId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  ids: [string];
  searchValue: string;
  payDate: string;
  contractHasnt: string;
  transactionType: string;
  description: string;
  total: number;
}
