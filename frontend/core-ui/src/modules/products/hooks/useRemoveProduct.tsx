import { OperationVariables, useMutation } from '@apollo/client';
import { IProduct } from 'ui-modules';
import { productRemove } from '../detail/graphql/mutations/productEditMutations';
import { productsQueries } from '@/products/graphql';

export const useRemoveProducts = () => {
  const [_removeProducts, { loading }] = useMutation(productRemove);

  const removeProducts = async (
    productIds: string[],
    options?: OperationVariables,
  ) => {
    await _removeProducts({
      ...options,
      variables: { productIds, ...options?.variables },
      update: (cache) => {
        try {
          cache.updateQuery(
            {
              query: productsQueries.products,
              variables: { perPage: 30, dateFilters: null },
            },
            ({ productsMain }) => ({
              productsMain: {
                ...productsMain,
                list: productsMain.list.filter(
                  (product: IProduct) => !productIds.includes(product._id),
                ),
                totalCount: productsMain.totalCount - productIds.length,
              },
            }),
          );
        } catch (e) {
          console.log(e);
        }
      },
    });
  };

  return { removeProducts, loading };
};