import { OperationVariables, useMutation } from '@apollo/client';
import { productsMutations } from '@/products/graphql';

export const useProductsEdit = () => {
  const [productsEdit, { loading }] = useMutation(
    productsMutations.productsEdit
  );

  const mutate = ({ _id, ...variables }: OperationVariables) => {
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

  return { mutate, loading };
};
