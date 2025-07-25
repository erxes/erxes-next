import { IAttachment } from 'erxes-ui/types';
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
  contractTypeCount: number;
  name: string;
  avatar: IAttachment;
  code: string;
  order: string;
}

export enum ContractTypeHotKeyScope {
  ContractTypesPage = 'categories-page',
  ContractTypeAddSheet = 'contractType-add-sheet',
  ContractTypeEditSheet = 'contractType-edit-sheet',
  ContractTypeAddSheetDescriptionField = 'contractType-add-sheet-description-field',
  ContractTypeAddSheetBarcodeDescriptionField = 'contractType-add-sheet-barcode-description-field',
}

export interface AddContractTypeResult {
  contractTypesAdd: {
    _id: string;
    __typename: string;
  };
}

export interface ContractTypeData {
  contractTypes: {
    list: AddContractTypeResult['contractTypesAdd'][];
    totalCount: number;
  };
}

export interface AddConrtactTypeVariables {
  code: string;
  name: string;
  description?: string;
  status?: string;
  number?: string;
  vacancy?: number;
  currency?: string;
  interestCalcType?: string;
  storeInterestInterval?: string;
  branchId?: string;
  isAllowIncome?: boolean;
  isAllowOutcome?: boolean;
  isDeposit?: boolean;
  interestRate?: number;
  closeInterestRate?: number;
  createdBy?: string;
  createdAt?: boolean;
  config?: IContractConfig;
  productType?: string;
  limitPercentage?: number;
}
