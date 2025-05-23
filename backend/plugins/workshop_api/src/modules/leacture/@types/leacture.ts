import { Document } from 'mongoose';

export interface ILeacture {
  name?: string;
}

export interface ILeactureDocument extends ILeacture, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
