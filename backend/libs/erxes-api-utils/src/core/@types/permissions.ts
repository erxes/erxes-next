export interface IPermission {
  module: string;
  action: string;
  userId?: string;
  groupId?: string;
  requiredActions: string[];
  allowed: boolean;
}

export interface IPermissionDocument extends IPermission, Document {
  _id: string;
}

export interface IActionMap {
  [key: string]: boolean;
}
