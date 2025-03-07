import { IAttachment, ICustomField, IPdfAttachment } from './common';

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
  subUoms?: IProductSubUom[];
  sameMasks?: string[];
  sameDefault?: string[];
  currency?: string;

  pdfAttachment?: IPdfAttachment;
}

export interface IProductDocument extends IProduct, Document {
  _id: string;
  createdAt: Date;
}

export interface IProductsConfig {
  code: string;
  value: any;
}

export interface IProductConfigDocument extends IProductsConfig, Document {
  _id: string;
}

export interface IProductSubUom {
  uom: string;
  ratio: number;
}

export interface IProductUom {
  code: string;
  name: string;
  timely?: string;
}

export interface IProductUomDocument extends IProductUom, Document {
  _id: string;
  createdAt: Date;
}

export interface IProductCategory {
  name: string;
  code: string;
  order: string;
  scopeBrandIds?: string[];
  description?: string;
  meta?: string;
  parentId?: string;
  attachment?: any;
  status?: string;
  maskType?: string;
  mask?: any;
  isSimilarity?: boolean;
  similarities?: {
    id: string;
    groupId: string;
    fieldId: string;
    title: string;
  }[];
}

export interface IProductCategoryDocument extends IProductCategory, Document {
  _id: string;
  createdAt: Date;
}
