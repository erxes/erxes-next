import { QueryHookOptions } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { IProductCategory } from '../types/category';
import { categories } from '../graphql/queries';

export interface ICategoryInline {
  _id: string;
  name: string;
  code: string;
  order: string;
  productCount: number;
  parentId?: string;
  attachment?: {
    url: string;
  };
}

export interface ICategoryInlineQuery {
  productCategoryDetail: ICategoryInline;
}

export const useCategoryInline = (
  options?: QueryHookOptions<ICategoryInlineQuery>,
) => {
  const { data, loading, error } = useQuery<ICategoryInlineQuery>(
    categories.productCategoryDetail,
    {
      ...options,
    },
  );

  return {
    category: data?.productCategoryDetail,
    loading,
    error,
  };
};
