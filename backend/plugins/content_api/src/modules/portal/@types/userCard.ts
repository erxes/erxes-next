import { Document } from 'mongoose';

export interface ICPUserCard {
  contentType: 'deal' | 'task' | 'ticket' | 'purchase';
  contentTypeId: string;
  portalUserId: string;
  status?:
    | 'participating'
    | 'invited'
    | 'left'
    | 'rejected'
    | 'won'
    | 'lost'
    | 'completed';
  paymentStatus?: 'paid' | 'unpaid';
  paymentAmount?: number;
  offeredAmount?: number;
  hasVat?: boolean;
}

export interface ICPUserCardDocument extends ICPUserCard, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
