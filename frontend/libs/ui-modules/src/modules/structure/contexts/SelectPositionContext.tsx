import { createContext } from 'react';
import { IPositionContext } from '../types/Position';

export const SelectPositionContext = createContext<IPositionContext>(
  {} as IPositionContext,
);
