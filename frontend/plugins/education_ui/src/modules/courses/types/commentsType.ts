export interface ICourseComment {
  _id: string;
  type: string;
  content: string;
  parentId?: string;
  courseId: string;
  updatedAt: Date;
  createdAt: Date;
}
