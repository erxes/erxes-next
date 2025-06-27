import { useContext } from 'react';
import { SelectBranchContext } from '../contexts/SelectBranchContext';

export const useSelectBranchContext = () => {
  return useContext(SelectBranchContext);
};
