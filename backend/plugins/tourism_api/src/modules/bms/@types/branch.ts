import { Document } from 'mongoose';

export interface IBranch {
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  user1Ids?: string[];
  user2Ids?: string[];
  paymentIds?: string[];
  paymentTypes?: any[];
  erxesAppToken: string;
  token: string;
  uiOptions?: any;
  permissionConfig?: any;
  status: string;
}
export interface IBranchDocument extends IBranch, Document {
  _id: string;
}
