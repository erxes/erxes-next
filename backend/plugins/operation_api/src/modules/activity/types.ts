import { Document } from 'mongoose';

export interface IActivity {
  action: string;
  contentId: string;
  module: string;
  metadata: any;
  createdBy: string;
}

export interface IActivityDocument extends IActivity, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
