import { z } from 'zod';
import { BRANCH_CREATE_SCHEMA } from '../schemas/branchSchema';

export interface IBranchListItem {
  _id: string;
  code: string;
  address: string;
  parentId: string;
  userCount: number;
  title: string;
}
export enum BranchHotKeyScope {
  BranchAddSheet = 'branch-add-sheet',
}

export type TBranchForm = z.infer<typeof BRANCH_CREATE_SCHEMA>;
