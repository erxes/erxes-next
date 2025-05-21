import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IComment {
  type: string;
  content: string;
  parentId?: string;
}

export interface ICommentParams extends IListParams, ICursorPaginateParams {
  type: string;
  content: string;
  parentId?: string;
}

export interface ICommentDocument extends IComment, Document {
  _id: string;
  createdAt?: Date;
  updatedAt: Date;
}
