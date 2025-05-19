
import { ICustomField } from "erxes-api-shared/src/core-types";
import { Document } from "mongoose";

export interface IPage {
  portalId: string;
  name: string;
  description: string;
  content: string;
  slug: string;
  layout: string;
  pageItems: any[];
  createdUserId: string;
  coverImage?: string;
  customFieldsData?: ICustomField;
}

export interface IPageDocument extends IPage, Document {
  _id: string;
}

