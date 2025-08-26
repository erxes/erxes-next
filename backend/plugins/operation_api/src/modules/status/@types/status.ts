import { Document } from 'mongoose';
import { STATUS_TYPES } from '@/status/constants/types';

export type StatusType = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];

export interface IStatus {
  name: string;
  teamId: string;
  description?: string;
  color?: string;
  type: StatusType;
  order: number;
}

export interface IStatusEditInput {
  _id: string;
  name: string;
  teamId: string;
  description?: string;
  color?: string;
  type: StatusType;
  order: number;
}

export interface IStatusDocument extends IStatus, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatusFilter {
  teamId: string;
  type: StatusType;
}
