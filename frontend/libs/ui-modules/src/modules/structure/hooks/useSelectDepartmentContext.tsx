import { useContext } from 'react';
import { SelectDepartmentContext } from '../contexts/SelectDepartmentContext';

export const useSelectDepartmentContext = () => {
  return useContext(SelectDepartmentContext);
};
