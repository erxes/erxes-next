import { productsMutations } from '@/products/graphql/ProductsMutations';
import { useMutation } from '@apollo/client';

export function useAddProduct() {
  const [productsAdd, { loading, error, data }] = useMutation(
    productsMutations.productsAdd
  );

  const addProduct = async (productsData) => {
    try {
      console.log(productsData);
      const response = await productsAdd({
        variables: productsData,
      });
      return response.data.addProduct;
    } catch (error) {
      console.error('Add product error:', error);
      throw error;
    }
  };

  return { addProduct, loading, error, data };
}
