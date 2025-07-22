import { Document } from 'mongoose';

export interface IStage {
  name?: string;
  probability?: string;
  pipelineId: string;
  visibility?: string;
  memberIds?: string[];
  canMoveMemberIds?: string[];
  canEditMemberIds?: string[];
  departmentIds?: string[];
  formId?: string;
  status?: string;
  code?: string;
  age?: number;
  defaultTick?: boolean;
  userId?: string;
}

export interface IStageDocument extends IStage, Document {
  _id: string;

  createdAt?: Date;
  order?: number;
  type: string;
}
