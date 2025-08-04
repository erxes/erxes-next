import { createContext, useContext } from 'react';
import { IProductCategory } from '../types/category';

export interface ICategoriesInlineContext {
  categories: IProductCategory[];
  loading: boolean;
  categoryIds?: string[];
  placeholder: string;
  updateCategories?: (categories: IProductCategory[]) => void;
}

export const CategoriesInlineContext =
  createContext<ICategoriesInlineContext | null>(null);

export const useCategoriesInlineContext = () => {
  const context = useContext(CategoriesInlineContext);
  if (!context) {
    throw new Error(
      'useCategoriesInlineContext must be used within a CategoriesInlineProvider',
    );
  }
  return context;
};
