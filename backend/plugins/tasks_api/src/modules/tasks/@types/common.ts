import { IStage } from "./stage";

export interface IRule {
    kind: string;
    text: string;
    condition: string;
    value: string;
  }
  
export interface ILink {
    [key: string]: string;
  }
  
export interface IRuleDocument extends IRule, Document {
    _id: string;
  }
   
  
export interface ICustomField {
    field: string;
    value: any;
    extraValue?: string;
    stringValue?: string;
    numberValue?: number;
    dateValue?: Date;
  }
  
export interface ICommonFields {
    userId?: string;
    createdAt?: Date;
    order?: number;
    type: string;
  }
  export interface IItemCommonFields {
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
    stage?: IStage[];
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
    type?: string;
  }
  