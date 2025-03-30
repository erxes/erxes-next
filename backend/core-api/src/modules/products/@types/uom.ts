import { Document } from 'mongoose';

export interface ISubUom {
  uom: string;
  ratio: number;
}

export interface IUom {
  code: string;
  name: string;
  timely?: string;
}

export interface IUomDocument extends IUom, Document {
  _id: string;
  createdAt: Date;
}
