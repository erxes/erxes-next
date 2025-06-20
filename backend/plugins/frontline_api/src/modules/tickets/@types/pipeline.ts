import { Document } from 'mongoose';

export enum PipelineVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface IPipeline {
  name?: string;
  boardId: string;
  status?: string;
  visibility?: PipelineVisibility;
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
  order?: number;
  userId?: string;
  type: string;
}

export interface IPipelineDocument extends IPipeline, Document {
  _id: string;

  createdAt: Date;
}
