import { IListParams } from '../../../@types';

export interface IProductParams extends IListParams {
  ids?: string[];
  excludeIds?: boolean;
  type?: string;
  status?: string;
  categoryId?: string;
  vendorId?: string;
  brand?: string;
  tag: string;
  tags?: string[];
  excludeTags?: string[];
  tagWithRelated?: boolean;
  sortField?: string;
  sortDirection?: number;
  pipelineId?: string;
  boardId?: string;
  segment?: string;
  segmentData?: string;
  groupedSimilarity?: string;
  image?: string;
}
