import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
export interface ICourseCategory {
  _id: string;
  name: string;
  description?: string;
  parentId?: string;
  code: string;
  isRoot?: boolean;
  activityCount?: number;
  attachment?: any;
  order: string;
}

export interface ICourseCategoryParams
  extends IListParams,
    ICursorPaginateParams {
  name: string;
  code?: string;
  categoryId: string;
  description?: string;
  createdAt?: Date;
  type?: string;
  attachment?: any;
  status?: string;
  startDate: Date;
  endDate?: Date;
  deadline?: Date;
  unitPrice: number;
}

export interface ICourseCategoryDocument extends ICourseCategory, Document {
  _id: string;
  createdAt: Date;
}
