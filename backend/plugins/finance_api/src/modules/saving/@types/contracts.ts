import {
  ICursorPaginateParams,
  ICustomField,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IContract {
  contractTypeId: string;
  number: string;
  status: string;
  branchId: string;
  description: string;
  savingAmount: number;
  blockAmount: number;
  startDate: Date;
  duration: number;
  endDate: Date;
  interestRate: number;
  closeInterestRate: number;

  customerId?: string;
  customerType?: string;

  closeDate?: Date;
  closeType?: string;
  closeDescription?: string;

  isSyncedPolaris?: boolean;
  isActiveSaving?: boolean;
  dealId?: string;
  storedInterest: number;
  lastStoredDate: Date;
  currency: string;
  interestCalcType: string;
  storeInterestInterval: string;
  isAllowIncome: boolean;
  isAllowOutcome: boolean;
  isDeposit: boolean;
  interestGiveType: string;
  closeOrExtendConfig: string;
  depositAccount: string;
  customFieldsData?: ICustomField[];
}

export interface IContractDocument extends IContract, Document {
  _id: string;
}

export interface IContractFilterQueryParams
  extends IListParams,
    ICursorPaginateParams {
  ids?: string[];
  searchValue?: string;
  customerId?: string;
}

export interface ICloseVariable {
  contractId: string;
  closeDate: Date;
  closeType: string;
  description: string;
}
