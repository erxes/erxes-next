import { useContext } from 'react';
import { SelectDepartmentsContext } from '../contexts/SelectDepartmentsContext';
import { ISelectDepartmentsContext } from '../types/Department';

export const useSelectDepartmentsContext = () => {
  const context = useContext(SelectDepartmentsContext);

  return context || ({} as ISelectDepartmentsContext);
};
