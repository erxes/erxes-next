export interface ICourseCategory {
  _id: string;
  name: string;
  description?: string;
  parentId?: string;
  code: string;
  isRoot?: boolean;
  activityCount?: number;
  attachment?: any;
}

export interface ICourseCategoryDocument extends ICourseCategory, Document {
  _id: string;
  order?: string;
  createdAt: Date;
}
