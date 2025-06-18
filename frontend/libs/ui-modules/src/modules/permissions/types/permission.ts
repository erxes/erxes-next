import { QueryHookOptions } from '@apollo/client';
import { ICursorListResponse } from 'erxes-ui';

export interface IPermission {
  _id: string;
  module: string;
  action: string;
  allowed: boolean;

  group?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    email: string;
  };
}

export interface IPermissionResponse extends ICursorListResponse<IPermission> {}

export interface IQueryPermissionsHookOptions
  extends QueryHookOptions<IPermissionResponse> {}

  export enum PermissionsFilterScope {
    FilterBar = 'permissions-filter-bar',
  }