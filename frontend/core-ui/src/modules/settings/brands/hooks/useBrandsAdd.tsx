import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import { ADD_BRANDS, GET_BRANDS } from '../grapqhl';
import { IBrand, TBrandsForm } from '../types';

interface BrandData {
  brands: {
    list: IBrand[];
    totalCount: number;
  };
}
type AddBrandResult = {
  brandsAdd: TBrandsForm;
};

export function useBrandsAdd(
  options?: MutationHookOptions<AddBrandResult, any>,
) {
  const [brandsAdd, { loading, error }] = useMutation(ADD_BRANDS, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<BrandData>({
          query: GET_BRANDS,
        });
        if (!existingData || !existingData.brands.list || !data?.brandsAdd)
          return;

        cache.writeQuery<BrandData>({
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
