import { Document } from 'mongoose';

export interface ILl {
  name?: string;
}

export interface ILlDocument extends ILl, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
