import { OperationVariables, useMutation } from '@apollo/client';
import { productsMutations } from '@/products/graphql';
import { ProductT } from '@/products/types/productTypes';

export const useProductsEdit = (getProduct: (_id: string) => ProductT) => {
  const [productsEdit, { loading }] = useMutation(
    productsMutations.productsEdit
  );

  const mutate = ({ _id, ...variables }: OperationVariables) => {
    const uom = getProduct(_id)?.uom;
    productsEdit({
      variables: { _id, ...variables, uom },
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

  return { mutate, loading };
};
