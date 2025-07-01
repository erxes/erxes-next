import { Document } from 'mongoose';

export interface ISaving {
  name?: string;
}

export interface ISavingDocument extends ISaving, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
