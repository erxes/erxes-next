import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface ICourse {
  name: string;
  code?: string;
  categoryId: string;
  description?: string;
  createdAt?: Date;
  type: string;
  attachment?: any;
  status?: string;
  startDate: Date;
  endDate?: Date;
  deadline?: Date;
  unitPrice: number;
}

export interface ICourseParams extends IListParams, ICursorPaginateParams {
  name: string;
  code?: string;
  categoryId: string;
  description?: string;
  createdAt?: Date;
  type?: string;
  attachment?: any;
  status?: string;
  startDate: Date;
  endDate?: Date;
  deadline?: Date;
  unitPrice: number;
}

export interface ICourseDocument extends ICourse, Document {
  createdAt: Date;
  modifiedAt: Date;
}
