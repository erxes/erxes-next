import { Document } from 'mongoose';

export interface IProject {
  name: string;
  description?: string;
  teamId: string;

  startDate: Date;
  endDate: Date;
}

export interface IProjectDocument extends IProject, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
