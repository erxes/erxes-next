import { Document } from 'mongoose';
import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';

export interface ITask {
  name: string;
  teamId: string;
  description?: string;
  status: string;
  priority?: string;
  labelIds?: string[];
  tagIds?: string[];
  assignee?: string;
  createdBy?: string;
  cycleId?: string;
  projectId?: string;
  estimatedPoint?: number;
}

export interface ITaskDocument extends ITask, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskFilter extends ICursorPaginateParams, IListParams, ITask {
  createdAt?: Date;
}
