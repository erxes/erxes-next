import { createContext, useContext } from 'react';
import { IBranch } from '../types';

export interface IBranchesInlineContext {
  branches: IBranch[];
  loading: boolean;
  branchIds?: string[];
  placeholder: string;
  updateBranches?: (branches: IBranch[]) => void;
}

export const BranchesInlineContext =
  createContext<IBranchesInlineContext | null>(null);

export const useBranchesInlineContext = () => {
  const context = useContext(BranchesInlineContext);
  if (!context) {
    throw new Error(
      'useBranchesInlineContext must be used within a BranchesInlineProvider',
    );
  }
  return context;
};
