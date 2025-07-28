import { Document } from 'mongoose';

export interface IBlock {
  number?: string;
  blockType: string;
  contractId?: string;
  customerId?: string;
  companyId?: string;
  description?: string;
  payDate: Date;
  amount: number;
  didAmount: number;
  status: string;
  currency: string;
  scheduleDate: Date;
  contractReaction?: any;
}

export interface IBlockDocument extends IBlock, Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
}
