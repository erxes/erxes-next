import { Document } from 'mongoose';

export interface IPortalCompany {
  erxesCompanyId: string;
  productCategoryIds?: string[];
  portalId: string;
}

export interface IPortalCompanyDocument extends IPortalCompany, Document {
  _id: string;
  createdAt?: Date;
}

