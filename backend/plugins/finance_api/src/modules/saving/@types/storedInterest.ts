import { Document } from 'mongoose';

export interface IStoredInterest {
  description: string;
  invDate: Date;
  prevStoredDate: Date;
  amount: number;
  contractId: string;
  type: string;
}

export interface IStoredInterestDocument extends IStoredInterest, Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
}
