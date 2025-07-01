import { IProduct } from 'ui-modules/modules';

export interface IContractConfig {
  transAccount: string;
  savingAccount: string;
  interestAccount: string;
  storedInterestAccount: string;
  minInterest: number;
  maxInterest: number;
  defaultInterest: number;
  minDuration: number;
  maxDuration: number;
  minAmount: number;
  maxAmount: number;
  storeInterestTime: string;
}

export interface IContractTypeDoc {
  code: string;
  name: string;
  description: string;
  status: string;
  number: string;
  vacancy: number;
  currency: string;
  interestCalcType: string;
  storeInterestInterval: string;
  branchId: string;
  isAllowIncome: boolean;
  isAllowOutcome: boolean;
  isDeposit: boolean;
  interestRate: number;
  closeInterestRate: number;
  createdBy?: string;
  createdAt?: boolean;
  config?: IContractConfig;
  productType: string;
  limitPercentage: number;
}

export interface IContractType extends IContractTypeDoc {
  _id: string;
  product: IProduct;
}
