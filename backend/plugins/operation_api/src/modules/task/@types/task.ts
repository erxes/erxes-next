import { Document } from 'mongoose';
import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';

export interface ITask {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  labelIds?: string[];
  tagIds?: string[];
  assignee?: string;
  cycleId?: string;
  projectId?: string;
}

export interface ITaskDocument extends ITask, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskFilter extends ICursorPaginateParams, IListParams, ITask {
  createdAt?: Date;
}
