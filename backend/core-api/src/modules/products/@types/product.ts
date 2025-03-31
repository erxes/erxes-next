import { Document } from 'mongoose';
import { ISubUom } from './uom';
import {
  IAttachment,
  ICustomField,
  IListParams,
  IPdfAttachment,
} from 'backend/core-api/src/@types';

export interface IProduct {
  name: string;
  shortName?: string;
  categoryId?: string;
  categoryCode?: string;
  type?: string;
  scopeBrandIds?: string[];
  description?: string;
  barcodes?: string[];
  variants: { [code: string]: { image?: IAttachment; name?: string } };
  barcodeDescription?: string;
  unitPrice?: number;
  code: string;
  customFieldsData?: ICustomField[];
  tagIds?: string[];
  attachment?: IAttachment;
  attachmentMore?: IAttachment[];
  status?: string;
  vendorId?: string;
  vendorCode?: string;

  mergedIds?: string[];

  uom?: string;
  subUoms?: ISubUom[];
  sameMasks?: string[];
  sameDefault?: string[];
  currency?: string;

  pdfAttachment?: IPdfAttachment;
}

export interface IProductDocument extends IProduct, Document {
  _id: string;
  createdAt: Date;
}

export interface IProductParams extends IListParams {
  ids?: string[];
  excludeIds?: boolean;
  type?: string;
  status?: string;
  categoryId?: string;
  searchValue?: string;
  vendorId?: string;
  brand?: string;
  tag: string;
  tags?: string[];
  excludeTags?: string[];
  tagWithRelated?: boolean;
  sortField?: string;
  sortDirection?: number;
  pipelineId?: string;
  boardId?: string;
  segment?: string;
  segmentData?: string;
  groupedSimilarity?: string;
  image?: string;
}
