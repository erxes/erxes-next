export * from './board';
export * from './checklist';
export * from './deal';
export * from './label';
export * from './pipeline';
export * from './stage';

export interface IArchiveArgs {
  pipelineId: string;
  search: string;
  page?: number;
  perPage?: number;
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
