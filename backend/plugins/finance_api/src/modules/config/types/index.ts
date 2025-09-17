import { Document, Types } from 'mongoose';

export type IConfig = {
  name: string;
  value: string;
  contentId?: Types.ObjectId;

  createdBy?: string;
  updatedBy?: string;
};

export type IConfigDocument = IConfig & Document;

export type IConfigFilterQuery = {
  name?: string;
  contentId?: string;
};

export type IConfigMutationQuery = {
  name?: string;
  value?: string;
  contentId?: string;
};
