import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IClass {
  name: string;
  description: string;
  location: string;
  level: string;
}

export interface IClassParams extends IListParams, ICursorPaginateParams {
  name: string;
  description: string;
  location: string;
  level: string;
}

export interface IClassDocument extends IClass, Document {
  _id: string;
  createdAt?: Date;
  updatedAt: Date;
}
