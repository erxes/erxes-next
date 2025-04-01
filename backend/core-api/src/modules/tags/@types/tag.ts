import { IListParams } from 'erxes-core-types';

export interface ITagFilterQueryParams extends IListParams {
  type: string;
  tagIds?: string[];
  parentId?: string;
  ids: string[];
  excludeIds: boolean;
}
