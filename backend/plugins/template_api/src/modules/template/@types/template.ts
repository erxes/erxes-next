import { Document } from 'mongoose';
export interface IRelatedContent {
  contentType: string;
  content: string[];
}
export interface ITemplate {
  name: string;
  description?: string;
  content: string;
  contentType: string;
  relatedContents?: [IRelatedContent];
  categoryIds?: string[];
  createdAt: Date;
}

export interface ITemplateDocument extends ITemplate, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICategory {
  name: string;
  parentId?: string;
  order: string;
  code: string;
  contentType: string;
  createdBy: string;
  updatedBy: string;
}
export interface ICategoryDocument extends ICategory, Document {
  _id: string;
  createdAt?: Date;
  updatedAt: Date;
}
export interface IContent {
  contentType: string;
  content: string[];
}
export interface IContentDocument extends IContent, Document {
  _id: string;
}
