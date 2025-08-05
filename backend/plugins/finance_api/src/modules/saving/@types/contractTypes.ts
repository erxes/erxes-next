import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IContractConfig {
  transAccount?: string;
  savingAccount?: string;
  interestAccount?: string;
  storedInterestAccount?: string;
  minInterest?: number;
  maxInterest?: number;
  defaultInterest?: number;
  minDuration?: number;
  maxDuration?: number;
  minAmount?: number;
  maxAmount?: number;
  storeInterestTime?: string;
}

export interface IContractType {
  code: string;
  name: string;
  description: string;
  status: string;
  number: string;
  vacancy: number;
  createdAt: Date;
  config: IContractConfig;
  currency: string;
  interestCalcType: string;
  interestRate: number;
  closeInterestRate: number;
  storeInterestInterval: string;
  branchId: string;
  isAllowIncome: boolean;
  isAllowOutcome: boolean;
  isDeposit: boolean;
  productType: string;
  limitPercentage: number;
}

export interface IContractTypeDocument extends IContractType, Document {
  _id: string;
  createdAt: Date;
}

export interface IContractTypeFilterQueryParams
  extends IListParams,
    ICursorPaginateParams {
  ids?: string[];
  excludeIds?: boolean;
  searchValue?: string;
  sortField?: string;
  sortDirection?: number;
  isDeposit?: boolean;
  productType?: string;
}
