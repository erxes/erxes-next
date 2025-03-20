export interface IAccountCategory {
  _id: string;
  createdAt: Date;
  name: string;
  code: string;
  order: string;
  scopeBrandIds?: string[];
  description?: string;
  parentId?: string;
  status?: string;
  mergeIds?: string[];
  maskType?: string;
  mask?: any;
  accountsCount?: number;
}

export interface IAccount {
  _id: string;
  createdAt: Date;
  code: string;
  name: string;
  categoryId?: string;
  parentId?: string;
  currency: string;
  kind: string;
  journal: string;
  description?: string;
  branchId?: string;
  departmentId?: string;
  scopeBrandIds?: string[];
  status: string;
  isTemp: boolean;
  isOutBalance: boolean;
  mergedIds?: string[];

  category?: IAccountCategory;
}

export enum AccountKind {
  ACTIVE = 'active',
  PASSIVE = 'passive',
}

export enum Journal {
  MAIN = 'main',
  CASH = 'cash',
  BANK = 'bank',
  DEBT = 'debt',
  INVENTORY = 'inventory',
  FIXED_ASSET = 'fixedAsset',
  TAX = 'tax',
}
