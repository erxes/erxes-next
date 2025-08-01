import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IBlock {
  number?: string;
  blockType: string;
  contractId?: string;
  customerId?: string;
  companyId?: string;
  description?: string;
  payDate: Date;
  amount: number;
  didAmount: number;
  status: string;
  currency: string;
  scheduleDate: Date;
  contractReaction?: any;
}

export interface IBlockDocument extends IBlock, Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
}

export interface IBlockQueryParams extends IListParams, ICursorPaginateParams {
  ids?: string[];
  number?: string;
  blockType?: string;
  contractId?: string;
  customerId?: string;
  companyId?: string;
  status?: string;
  currency?: string;
  payDateFrom?: Date;
  payDateTo?: Date;
  scheduleDateFrom?: Date;
  scheduleDateTo?: Date;

  sortField?: keyof IBlock;
  sortDirection?: 1 | -1;
}
