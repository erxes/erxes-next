import { IListParams } from 'core-api/@types';
import { Document } from 'mongoose';

export interface ITag {
  name: string;
  type: string;
  colorCode?: string;
  objectCount?: number;
  parentId?: string;
}

export interface ITagDocument extends ITag, Document {
  _id: string;
  createdAt: Date;
  order?: string;
  relatedIds?: string[];
}

export interface ITagFilterQueryParams extends IListParams {
  type: string;
  tagIds?: string[];
  parentId?: string;
  ids: string[];
  excludeIds: boolean;
}
