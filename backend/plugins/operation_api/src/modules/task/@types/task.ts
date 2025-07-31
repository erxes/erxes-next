import { Document } from 'mongoose';

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
