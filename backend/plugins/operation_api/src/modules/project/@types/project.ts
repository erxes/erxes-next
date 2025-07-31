import { Document } from 'mongoose';
import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';

export interface IProject {
  name: string;
  description?: string;
  teamId: string;
  priority?: string;
  startDate: Date;
  endDate: Date;
}

export interface IProjectFilter extends ICursorPaginateParams, IListParams {
  name?: string;
  description?: string;
  teamId?: string;
  priority?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export interface IProjectDocument extends IProject, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
