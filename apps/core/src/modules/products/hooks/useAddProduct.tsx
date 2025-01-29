import { productsMutations } from '@/products/graphql/ProductsMutations';
import { useMutation } from '@apollo/client';

export function useAddProduct() {
  const [productsAdd, { loading, error, data }] = useMutation(
    productsMutations.productsAdd
  );

  const addProduct = async (productsData) => {
    const response = await productsAdd({
      variables: productsData,
    });
    return response.data.addProduct;
  };

  return { addProduct, loading, error, data };
}
