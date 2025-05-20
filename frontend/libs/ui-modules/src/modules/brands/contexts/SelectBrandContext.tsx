import { createContext } from 'react';
import { IBrandSelectContext } from '../types';

export const SelectBrandContext = createContext<IBrandSelectContext>(
  {} as IBrandSelectContext,
);
