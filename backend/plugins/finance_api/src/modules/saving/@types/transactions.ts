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
