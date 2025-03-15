import { Document, HydratedDocument } from 'mongoose';
import { IAttachment, IRule } from '../@types/common';

export interface IForm {
  _id: string;
  createdUserId: string;
  createdDate: Date;
  name: string;
  title: string;
  code?: string;
  type: string;
  description?: string;
  numberOfPages?: number;
  buttonText?: string;
  tagIds?: string[];

  departmentIds?: string[];
  languageCode?: string;
  visibility?: string;
  status?: string;
  brandId?: string;
  leadData?: ILeadData;
  integrationId?: string;
}

export interface IFormSubmissionFilter {
  operator: string;
  value: any;
  formFieldId: string;
}

export interface ICallout extends Document {
  title?: string;
  body?: string;
  buttonText?: string;
  featuredImage?: string;
  skip?: boolean;
  calloutImgSize?: string;
}

export interface ILeadData {
  loadType?: string;
  successAction?: string;
  fromEmail?: string;
  userEmailTitle?: string;
  userEmailContent?: string;
  adminEmails?: string;
  adminEmailTitle?: string;
  adminEmailContent?: string;
  thankTitle?: string;
  thankContent?: string;
  redirectUrl?: string;
  themeColor?: string;
  callout?: ICallout;
  rules?: IRule;
  viewCount?: number;
  contactsGathered?: number;
  isRequireOnce?: boolean;
  saveAsCustomer?: boolean;
  clearCacheAfterSave?: boolean;
  templateId?: string;
  attachments?: IAttachment[];
  css?: string;
  successImage?: string;
  successImageSize?: string;
  verifyEmail?: boolean;
}

export interface ILeadDataDocument extends ILeadData, Document {
  viewCount?: number;
  contactsGathered?: number;
}

export type IFormDocument = HydratedDocument<IForm>;

export interface IFormSubmission {
  customerId?: string;
  userId?: string;
  contentType?: string;
  contentTypeId?: string;
  formId?: string;
  formFieldId?: string;
  value?: JSON;
  submittedAt?: Date;
  groupId?: string;
}

export interface IFormSubmissionDocument extends IFormSubmission, Document {
  _id: string;
}

export interface ISubmission {
  _id: string;
  value: any;
  type?: string;
  validation?: string;
}

export interface IError {
  fieldId: string;
  code: string;
  text: string;
}

export interface IFormsEdit extends IForm {
  _id: string;
}
