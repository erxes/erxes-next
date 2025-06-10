import { Document } from 'mongoose';
import {
  IAttachment,
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';

export interface ICar {
  ownerId: String;
  plateNumber: String;
  vinNumber: String;
  colorCode: String;
  categoryId: String;
  bodyType: String;
  fuelType: String;
  gearBox: String;
  vintageYear: Number;
  importYear: Number;
  status: String;
  description: String;
  tagIds: [String];
  mergedIds: [String];
  searchText: String;
  attachment: IAttachment;
}

export interface ICarDocument extends ICar, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  searchText: string;
}

export interface ICarParams extends IListParams, ICursorPaginateParams {
  ids?: string[];
  categoryId?: string;
  searchValue?: string;
  tag?: string;
}
