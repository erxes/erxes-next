import { IListParams } from 'erxes-api-shared/core-types';

export interface ITagFilterQueryParams extends IListParams {
  type: string;
  tagIds?: string[];
  parentId?: string;
  ids: string[];
  excludeIds: boolean;
}
