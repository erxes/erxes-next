import { useContext } from 'react';
import { SelectBrandContext } from '../contexts/SelectBrandContext';

export const useSelectBrandContext = () => {
  return useContext(SelectBrandContext);
};
