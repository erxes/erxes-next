import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';

interface AddCategoryResult {
  productCategoriesAdd: {
    _id: string;
    __typename: string;
  };
}

interface CategoryData {
  productCategories: {
    list: AddCategoryResult['productCategoriesAdd'][];
    totalCount: number;
  };
}

import { categoryAdd } from '../graphql/mutations';
import { productsQueries } from '@/products/graphql';

export function useAddCategory(
  options?: MutationHookOptions<AddCategoryResult, any>,
) {
  const [productCategoriesAdd, { loading, error }] = useMutation<AddCategoryResult>(
    categoryAdd,
    {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const queryVariables = { perPage: 30 };
          const existingData = cache.readQuery<CategoryData>({
            query: productsQueries.productCategories,
            variables: queryVariables,
          });

          if (!existingData || !existingData.productCategories || !data?.productCategoriesAdd)
            return;

          cache.writeQuery<CategoryData>({
            query: productsQueries.productCategories,
            variables: queryVariables,
            data: {
              productCategories: {
                ...existingData.productCategories,
                list: [...existingData.productCategories.list, data.productCategoriesAdd],
                totalCount: existingData.productCategories.totalCount + 1,
              },
            },
          });
        } catch (e) {
          console.error('Cache update error:', e);
        }
      },
    },
  );

  return { productCategoriesAdd, loading, error };
}
