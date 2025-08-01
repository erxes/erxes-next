import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IPeriodLock {
  createdBy: string;
  createdAt: Date;
  date: Date;
  excludeContracts: string[];
}

export interface IPeriodLockDocument extends IPeriodLock, Document {
  _id: string;
}

export interface IPeriodLockQueryParams
  extends IListParams,
    ICursorPaginateParams {
  ids?: string[];
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  excludeContract?: string;

  startDate?: string | Date;
  endDate?: string | Date;
  sortField?: keyof IPeriodLock;
  sortDirection?: 1 | -1;
}
