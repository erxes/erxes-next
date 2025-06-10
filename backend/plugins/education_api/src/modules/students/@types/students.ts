import {
  ICursorPaginateParams,
  IDetail,
  ILink,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IStudent {
  username?: string;
  password: string;
  email?: string;
  details?: IDetail;
  links?: ILink;
  isActive?: boolean;
  deviceTokens?: string[];
}

export interface IStudentParams extends IListParams, ICursorPaginateParams {
  userId?: string;
}

export interface IStudentDocument extends IStudent, Document {
  createdAt?: Date;
  updatedAt: Date;
}
