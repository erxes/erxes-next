import { useContext } from 'react';
import { SelectUnitContext } from '../contexts/SelectUnitContext';

export const useSelectUnitContext = () => {
  return useContext(SelectUnitContext);
};
