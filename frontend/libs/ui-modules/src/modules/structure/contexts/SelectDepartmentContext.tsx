import { createContext } from 'react';
import { IDepartmentContext } from '../types/Department';

export const SelectDepartmentContext = createContext<IDepartmentContext>(
  {} as IDepartmentContext,
);
