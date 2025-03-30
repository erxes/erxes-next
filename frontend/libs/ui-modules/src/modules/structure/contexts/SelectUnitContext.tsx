import { createContext } from 'react';
import { IUnitContext } from '../types/Unit';

export const SelectUnitContext = createContext<IUnitContext>(
  {} as IUnitContext,
);
