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
  startDate?: Date;
  targetDate?: Date;
  leadId?: string;
}

export interface IProjectFilter extends ICursorPaginateParams, IListParams {
  name?: string;
  description?: string;
  teamId?: string;
  priority?: string;
  startDate?: Date;
  targetDate?: Date;
  leadId?: string;
}

export interface IProjectDocument extends IProject, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
