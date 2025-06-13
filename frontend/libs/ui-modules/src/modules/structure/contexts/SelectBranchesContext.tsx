import { createContext, useContext } from 'react';
import { IBranch } from '../types/Branch';

export interface ISelectBranchesContext {
  branchIds: string[];
  onSelect: (branch: IBranch) => void;
  branches: IBranch[];
  setBranches: (branches: IBranch[]) => void;
  loading: boolean;
  error: Error | null;
}

export const SelectBranchesContext = createContext<ISelectBranchesContext | null>(null);

export const useSelectBranchesContext = () => {
  const context = useContext(SelectBranchesContext);
  if (!context) {
    throw new Error(
      'useSelectBranchesContext must be used within a SelectBranchesProvider',
    );
  }
  return context;
};