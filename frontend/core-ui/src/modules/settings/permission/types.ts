export interface IPermission {
  _id: string;
  module?: string;
  action?: string;
  userId?: string;
  groupId?: string;
  allowed?: boolean;
  group?: {
    _id: string;
    name?: string;
  };
  user?: {
    _id: string;
    username?: string;
    email?: string;
  };
}
