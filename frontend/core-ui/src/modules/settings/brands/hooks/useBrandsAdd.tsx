import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import { IBrand } from 'ui-modules/modules/brands/types';
import { TBrandsForm } from './useBrandsForm';
import { ADD_BRANDS } from '../grapqhl';
import { GET_BRANDS } from 'ui-modules';

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
