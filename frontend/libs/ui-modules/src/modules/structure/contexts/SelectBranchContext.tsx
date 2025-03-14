import { createContext } from 'react';
import { IBranchContext } from '../types/Branch';

export const SelectBranchContext = createContext<IBranchContext>(
  {} as IBranchContext,
);
