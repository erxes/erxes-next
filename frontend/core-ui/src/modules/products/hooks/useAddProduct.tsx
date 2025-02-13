import { useMutation } from '@apollo/client';

import { productsMutations } from '@/products/graphql/ProductsMutations';

export function useAddProduct() {
  const [productsAdd, { loading, error, data }] = useMutation(
    productsMutations.productsAdd,
    {
      update: (cache, { data: { productsAdd } }) => {
        cache.modify({
          id: cache.identify(productsAdd),
          fields: {
            products: (existingData) => [productsAdd, ...existingData],
          },
        });
      },
    },
  );
  return { productsAdd, loading, error, data };
}
