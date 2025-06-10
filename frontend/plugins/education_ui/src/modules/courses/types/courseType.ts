import { IAttachment } from 'erxes-ui/types';

export interface ICourse {
  _id: string;
  name: string;
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
  limit: number;
}

export interface ICourseCategory {
  _id: string;
  name: string;
  description?: string;
  parentId?: string;
  code: string;
  isRoot?: boolean;
  activityCount?: number;
  order: string;
  attachment?: IAttachment;
}
