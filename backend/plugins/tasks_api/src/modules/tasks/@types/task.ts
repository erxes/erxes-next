// modules/tasks/@types/task.ts
import { Document } from 'mongoose';

export interface ITask {
  name?: string;
  userId?: string;
  stageId: string; // Fixed: singular
  assignedUserIds?: string[];
  tagIds?: string[];
  labelIds?: string[];
  watchedUserIds?: string[];
}

export interface ITaskDocument extends ITask, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
