import { useContext } from 'react';
import { SelectPositionContext } from '../contexts/SelectPositionContext';

export const useSelectPositionContext = () => {
  return useContext(SelectPositionContext);
};
