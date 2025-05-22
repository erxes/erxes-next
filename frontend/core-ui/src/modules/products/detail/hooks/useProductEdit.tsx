import { OperationVariables, useMutation } from '@apollo/client';
import { productEdit } from '../graphql/mutations/productEditMutations';

export const useProductEdit = () => {
  const [_productEdit, { loading }] = useMutation(productEdit);

  const editProduct = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};

    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });

    return _productEdit({
      ...operationVariables,
      variables,
      update: (cache, { data }) => {
        const editedProduct = data?.productsEdit;
        if (!editedProduct) return;

        cache.modify({
          id: cache.identify(editedProduct),
          fields: fieldsToUpdate,
        });
      },
    });
  };

  return { editProduct, loading };
};