import { Document } from 'mongoose';

export interface Icontent {
  name: string;
  description: string;
}

export interface IcontentDocument extends Icontent, Document {
  createdAt: Date;
  modifiedAt: Date;
}
