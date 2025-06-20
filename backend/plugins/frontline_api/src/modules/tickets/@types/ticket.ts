import {
  ICursorPaginateParams,
  ICustomField,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';
import { IStage } from '~/modules/tickets/@types/stage';

export interface ITicket {
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
  type?: string;

  source?: string;
}

export interface ITicketDocument extends ITicket, Document {
  _id: string;

  stage?: IStage[];
  createdAt?: Date;
}

export interface ITicketQueryParams extends IListParams, ICursorPaginateParams {
  pipelineId: string;
  pipelineIds: string[];
  stageId: string;
  _ids?: string;
  skip?: number;
  limit?: number;
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

export interface IArchiveArgs extends ICursorPaginateParams {
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
