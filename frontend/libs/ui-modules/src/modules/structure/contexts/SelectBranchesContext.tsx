import { createContext } from 'react';
import { IBranch } from '../types/Branch';

export interface ISelectBranchesContext {
  branchIds: string[];
  onSelect: (branch: IBranch) => void;
  branches: IBranch[];
  setBranches: (branches: IBranch[]) => void;
  loading: boolean;
  error: Error | null;
}

export const SelectBranchesContext = createContext<ISelectBranchesContext>({
  branchIds: [],
  onSelect: () => {},
  branches: [],
  setBranches: () => {},
  loading: false,
  error: null,
});
