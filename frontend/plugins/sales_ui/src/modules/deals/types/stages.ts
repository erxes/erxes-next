export interface IStage {
    _id: string;
    name: string;
    type: string;
    probability: string;
    index?: number;
    itemId?: string;
    unUsedAmount?: any;
    amount?: any;
    itemsTotalCount: number;
    formId: string;
    pipelineId: string;
    visibility: string;
    memberIds: string[];
    canMoveMemberIds?: string[];
    canEditMemberIds?: string[];
    departmentIds: string[];
    status: string;
    order: number;
    code?: string;
    age?: number;
    defaultTick?: boolean;
  }