import { useContext } from 'react';
import { ISelectPositionsContext } from '../types/Position';
import { SelectPositionsContext } from '../contexts/SelectPositionsContext';

export const useSelectPositionsContext = () => {
  const context = useContext(SelectPositionsContext);

  return context || ({} as ISelectPositionsContext);
};
