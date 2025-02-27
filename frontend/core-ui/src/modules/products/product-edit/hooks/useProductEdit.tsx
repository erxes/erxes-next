import { OperationVariables, useMutation } from '@apollo/client';
import { PRODUCT_EDIT } from '../graphql/mutations/productEditorMutation';

export const useProductsEdit = () => {
    const [_productEdit, { loading }] = useMutation(PRODUCT_EDIT);
  
    const productsEdit = (
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
        update: (cache, { data: { productsEdit } }) => {
          cache.modify({
            id: cache.identify(productsEdit),
            fields: fieldsToUpdate,
          });
        },
      });
    };
    return { productsEdit, loading };
  };
  