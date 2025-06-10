import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface ITeacher {
  userId: string;
}

export interface ITeacherParams extends IListParams, ICursorPaginateParams {
  userId?: string;
}

export interface ITeacherDocument extends ITeacher, Document {
  createdAt?: Date;
  updatedAt: Date;
}
