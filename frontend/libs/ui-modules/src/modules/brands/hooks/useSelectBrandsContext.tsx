import { useContext } from 'react';
import { SelectBrandsContext } from '../contexts/SelectBrandsContext';
import { ISelectBrandsContext } from '../types/brand';

export const useSelectBrandsContext = () => {
  const context = useContext(SelectBrandsContext);

  return context || ({} as ISelectBrandsContext);
};
