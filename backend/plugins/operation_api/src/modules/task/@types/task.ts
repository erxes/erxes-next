import { Document } from 'mongoose';
import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';

export interface ITask {
  name: string;
  teamId: string;
  description?: string;
  status?: string;
  priority?: string;
  labelIds?: string[];
  tagIds?: string[];
  assigneeId?: string;
  createdBy?: string;
  cycleId?: string;
  projectId?: string;
  estimatedPoint?: number;
  userId?: string;
  startDate?: Date;
  targetDate?: Date;
  createdAt?: Date;
  complatedDate?: Date;
}

export interface ITaskUpdate extends ITask {
  _id: string;
}

export interface ITaskDocument extends ITask, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskFilter extends ICursorPaginateParams, IListParams, ITask {
  userId?: string;
  createdAt?: Date;
}
