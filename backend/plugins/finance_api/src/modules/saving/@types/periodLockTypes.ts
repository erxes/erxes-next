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
