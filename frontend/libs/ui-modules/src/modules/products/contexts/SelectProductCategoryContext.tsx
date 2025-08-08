import { createContext, useContext } from 'react';
import { IProductCategory } from '../categories/types/category';

export type ISelectProductCategoryContext = {
  categoryIds: string[];
  categories: IProductCategory[];
  setCategories: (categories: IProductCategory[]) => void;
  onSelect: (category: IProductCategory) => void;
  loading: boolean;
  error: string | null;
};

export const SelectProductCategoryContext =
  createContext<ISelectProductCategoryContext | null>(null);

export const useSelectProductCategoryContext = () => {
  const context = useContext(SelectProductCategoryContext);
  if (!context) {
    throw new Error(
      'useSelectProductCategoryContext must be used within a SelectProductCategoryProvider',
    );
  }
  return context;
};
