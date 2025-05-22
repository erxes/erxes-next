import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import { EDIT_BRANDS, GET_BRANDS } from '../grapqhl';
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

export function useBrandsEdit(
  options?: MutationHookOptions<AddBrandResult, any>,
) {
  const [handleEdit, { loading, error }] = useMutation(EDIT_BRANDS, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<BrandData>({
          query: GET_BRANDS,
        });
        if (!existingData || !existingData.brands || !data?.brandsEdit) return;

        cache.writeQuery<BrandData>({
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
