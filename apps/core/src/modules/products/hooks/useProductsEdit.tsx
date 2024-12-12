import { useMutation } from '@apollo/client';
import { productsMutations } from '@/products/graphql';
import { ProductT } from '@/products/types/productTypes';

export const useProductsEdit = () => {
  const [productsEdit, { loading }] = useMutation(
    productsMutations.productsEdit
  );

  const handleProductsEdit = ({
    _id,
    ...variables
  }: Partial<Omit<ProductT, '_id'>> & { _id: string }) => {
    productsEdit({
      variables: { _id, ...variables },
      update: (cache, { data: { productsEdit } }) => {
        cache.modify({
          id: cache.identify(productsEdit),
          fields: Object.keys(variables).reduce((fields, field) => {
            fields[field] = () => variables[field];
            return fields;
          }, {}),
          optimistic: true,
        });
      },
    });
  };

  return { handleProductsEdit, loading };
};
