import { IListParams } from './common';
import { Document } from 'mongoose';

export interface IApp {
  isEnabled?: boolean;
  name: string;
  userGroupId: string;
  expireDate?: Date;
  noExpire?: boolean;
  allowAllPermission?: boolean;
}
export interface IAppDocument extends IApp, Document {
  _id: string;
  createdAt: Date;
  accessToken: string;
  refreshToken: string;
}
export interface IAppQueryFilterParams extends IListParams {
  name?: string;
  isEnabled?: boolean;
}
