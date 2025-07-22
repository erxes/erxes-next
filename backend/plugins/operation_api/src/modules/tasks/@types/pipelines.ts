import { Document } from 'mongoose';

export interface IPipeline {
  name?: string;
  boardId: string;
  status?: string;
  visibility?: string;
  memberIds?: string[];
  bgColor?: string;
  watchedUserIds?: string[];
  startDate?: Date;
  endDate?: Date;
  metric?: string;
  hackScoringType?: string;
  templateId?: string;
  isCheckDate?: boolean;
  isCheckUser?: boolean;
  isCheckDepartment?: boolean;
  excludeCheckUserIds?: string[];
  numberConfig?: string;
  numberSize?: string;
  nameConfig?: string;
  lastNum?: string;
  departmentIds?: string[];
  branchIds?: string[];
  tagId?: string;
  userId?: string;
}

export interface IPipelineDocument extends IPipeline, Document {
  _id: string;

  createdAt?: Date;
  order?: number;
  type: string;
}
