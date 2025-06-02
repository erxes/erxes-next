import { OperationVariables, useMutation } from '@apollo/client';
import { IProduct } from 'ui-modules';
import { productsMutations } from '@/products/graphql';
import { productsQueries } from '@/products/graphql';

const PRODUCTS_PAGE_SIZE = 30;

export const useRemoveProducts = () => {
  const [_removeProducts, { loading }] = useMutation(productsMutations.productRemove);

  const removeProducts = (
    productIds: string[],
    options?: OperationVariables,
  ) => {
    _removeProducts({
      ...options,
      variables: { productIds, ...options?.variables },
      update: (cache) => {
        try {
          cache.updateQuery(
            {
              query: productsQueries.products,
              variables: { perPage: PRODUCTS_PAGE_SIZE, dateFilters: null },
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