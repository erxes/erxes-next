import { Document } from 'mongoose';
import { IAttachment } from 'erxes-api-shared/core-types';

export interface ICarCategory {
  name: String;
  code: String;
  parentId: String;
  description: String;
  image: IAttachment;
  secondaryImages: [IAttachment];
  productCategoryId: String;
}

export interface ICarCategoryDocument extends ICarCategory, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
