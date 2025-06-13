import { useContext } from 'react';
import { SelectBranchesContext } from '../contexts/SelectBranchesContext';

export const useSelectBranchesContext = () => {
  const context = useContext(SelectBranchesContext);
  if (!context) {
    throw new Error(
      'useSelectBranchesContext must be used within SelectBranchesProvider',
    );
  }
  return context;
};
