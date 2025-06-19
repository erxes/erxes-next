import { Document } from 'mongoose';

export interface ITasks {
  name?: string;
}

export interface ITasksDocument extends ITasks, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
