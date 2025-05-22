import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import { ADD_BRANDS, GET_BRANDS } from '../grapqhl';
import { IBrand, IBrandData, TAddBrandResult, TBrandsForm } from '../types';

export function useBrandsAdd(
  options?: MutationHookOptions<TAddBrandResult, any>,
) {
  const [brandsAdd, { loading, error }] = useMutation(ADD_BRANDS, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<IBrandData>({
          query: GET_BRANDS,
        });
        if (!existingData || !existingData.brands.list || !data?.brandsAdd)
          return;

        cache.writeQuery<IBrandData>({
          query: GET_BRANDS,
          data: {
            brands: {
              ...existingData.brands,
              list: [data.brandsAdd, ...existingData.brands.list],
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
    brandsAdd,
    loading,
    error,
  };
}
