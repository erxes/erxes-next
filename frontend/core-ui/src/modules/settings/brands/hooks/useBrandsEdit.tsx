import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import { EDIT_BRANDS, GET_BRANDS } from '../grapqhl';
import { IBrandData, TAddBrandResult } from '../types';

export function useBrandsEdit(
  options?: MutationHookOptions<TAddBrandResult, any>,
) {
  const [handleEdit, { loading, error }] = useMutation(EDIT_BRANDS, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<IBrandData>({
          query: GET_BRANDS,
        });
        if (!existingData || !existingData.brands || !data?.brandsEdit) return;

        cache.writeQuery<IBrandData>({
          query: GET_BRANDS,
          data: {
            brands: {
              ...existingData.brands,
              list: [data.brandsEdit, ...existingData.brands.list],
              totalCount: existingData.brands.totalCount + 1,
            },
          },
        });
      } catch (e) {
        console.log('error', e);
      }
    },
  });

  return {
    handleEdit,
    loading,
    error,
  };
}
