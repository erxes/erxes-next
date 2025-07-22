import {
  ICursorPaginateParams,
  ICustomField,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface ITask {
  name?: string;
  // TODO migrate after remove 2row
  companyIds?: string[];
  customerIds?: string[];
  startDate?: Date;
  closeDate?: Date;
  stageChangedDate?: Date;
  description?: string;
  assignedUserIds?: string[];
  watchedUserIds?: string[];
  notifiedUserIds?: string[];
  labelIds?: string[];
  attachments?: any[];
  stageId: string;
  initialStageId?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  userId?: string;
  createdAt?: Date;
  order?: number;
  searchText?: string;
  priority?: string;
  sourceConversationIds?: string[];
  status?: string;
  timeTrack?: {
    status: string;
    timeSpent: number;
    startDate?: string;
  };
  customFieldsData?: ICustomField[];
  score?: number;
  number?: string;
  data?: any;
  tagIds?: string[];
  branchIds?: string[];
  departmentIds?: string[];
  parentId?: string;
}

export interface ITaskDocument extends ITask, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskQueryParams extends IListParams, ICursorPaginateParams {
  pipelineId: string;
  pipelineIds: string[];
  stageId: string;
  _ids?: string;
  date?: {
    month: number;
    year: number;
  };
  search?: string;
  customerIds?: string[];
  companyIds?: string[];
  assignedUserIds?: string[];
  labelIds?: string[];
  userIds?: string[];
  segment?: string;
  segmentData?: string;
  stageChangedStartDate?: Date;
  stageChangedEndDate?: Date;
  noSkipArchive?: boolean;
  tagIds?: string[];
  number?: string;
}

export interface IArchivedTaskQueryParams
  extends IListParams,
    ICursorPaginateParams {
  pipelineId: string;
  search: string;
  userIds?: string[];
  priorities?: string[];
  assignedUserIds?: string[];
  labelIds?: string[];
  productIds?: string[];
  companyIds?: string[];
  customerIds?: string[];
  startDate?: string;
  endDate?: string;
  sources?: string[];
  hackStages?: string[];
}
