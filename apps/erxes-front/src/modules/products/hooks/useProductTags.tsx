import { useQuery } from '@apollo/client';

import { productsQueries } from '../graphql/ProductsQueries';

export const useProductTags = () => {
  const { data, loading } = useQuery(productsQueries.productTags, {
    variables: {
      perPage: 1000,
    },
  });

  return { options: data?.tags, loading };
};
