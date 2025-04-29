import { IAccount } from '@/settings/account/types/Account';
import { ICtaxRow } from '@/settings/types/Ctax';
import { IVatRow } from '@/settings/types/Vat';
import { IProduct } from 'ui-modules';

export interface ITransaction {
  _id?: string;
  date?: Date;
  description?: string;
  status?: string;
  ptrId?: string;
  parentId?: string;
  number?: string;
  journal: string;
  ptrStatus?: string;
  originId?: string;
  follows?: {
    type: string;
    id: string;
  }[];
  preTrId?: string;

  branchId?: string;
  departmentId?: string;
  customerType?: string;
  customerId?: string;
  assignedUserIds?: string[];

  details: ITrDetail[];
  shortDetail?: ITrDetail;
  createdBy?: string;
  modifiedBy?: string;

  createdAt?: Date;
  modifiedAt?: Date;

  followInfos?: any;

  hasVat?: boolean;
  vatRowId?: string;
  afterVat?: boolean;
  isHandleVat?: boolean;
  vatAmount?: number;
  vatRow?: IVatRow;

  hasCtax?: boolean;
  ctaxRowId?: string;
  isHandleCtax?: boolean;
  ctaxAmount?: number;
  ctaxRow?: ICtaxRow;

  sumDt: number;
  sumCt: number;
  permission?: string;

  branch?: any;
  department?: any;
}
export interface ITrInput {
  ptrId: string;
  parentId: string;
  number: string;
  date: Date;
  description: string;
  journal: string;

  branchId: string;
  departmentId: string;
  customerType: string;
  customerId: string;
  assignedUserIds?: [string];

  accountId: string;
  side: string;
  amount: number;
}

export interface ITrDetail {
  _id?: string;
  accountId?: string;
  originId?: string;
  followInfos?: any;
  follows?: {
    type: string;
    id: string;
  }[];

  side?: string;
  amount?: number;
  currencyAmount?: number;
  customRate?: number;
  assignedUserId?: string;

  excludeVat?: boolean;
  excludeCtax?: boolean;

  productId?: string;
  count?: number;
  unitPrice?: number;

  account?: IAccount;
  product?: IProduct;
}
