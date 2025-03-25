import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { productsMutations } from '@/products/graphql/ProductsMutations';
import { productsQueries } from '@/products/graphql';
import { IProduct } from '@/products/types/productTypes';

interface ProductData {
  products: IProduct[];
  productsTotalCount: number;
}

interface AddProductResult {
  productsAdd: IProduct;
}

export function useAddProduct(
  options?: MutationHookOptions<AddProductResult, any>,
) {
  const [productsAdd, { loading, error }] = useMutation<AddProductResult>(
    productsMutations.productsAdd,
    {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const queryVariables = { perPage: 30 };
          const existingData = cache.readQuery<ProductData>({
            query: productsQueries.products,
            variables: queryVariables,
          });

          if (!existingData || !existingData.products || !data?.productsAdd)
            return;
          cache.writeQuery<ProductData>({
            query: productsQueries.products,
            variables: queryVariables,
            data: {
              ...(existingData || []),
              products: [data.productsAdd, ...existingData.products],
              productsTotalCount: existingData.productsTotalCount + 1,
            },
          });
        } catch (e) {
          console.error('error:', e);
        }
      },
    },
  );

  return { productsAdd, loading, error };
}
