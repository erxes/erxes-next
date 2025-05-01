import { Document } from 'mongoose';

export interface ISample {
  name: string;
  description: string;
}

export interface ISampleDocument extends ISample, Document {
  createdAt: Date;
  modifiedAt: Date;
}
