import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IClass {
  name: string;
  activityId: string;
  dates: string[];
  startTime: Date;
  endTime: Date;
  limit: number;
  entries: number;
}

export interface IClassDocument extends IClass, Document {
  _id: string;
  createdAt?: Date;
  modifiedAt: Date;
  schedules?: string[];
}
