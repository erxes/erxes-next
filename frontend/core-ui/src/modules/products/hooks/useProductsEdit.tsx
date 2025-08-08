import { MutationHookOptions, useMutation } from '@apollo/client';
import { useToast } from 'erxes-ui';
import { productsMutations } from '@/products/graphql';

export const useProductsEdit = () => {
  const { toast } = useToast();
  const [productsEdit, { loading }] = useMutation(
    productsMutations.productsEdit,
  );

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    productsEdit({
      ...options,
      variables,
      onError: () => {
        toast({
          title: 'Error',
          description: 'Product update failed',
          variant: 'destructive',
        });
      },
      update: (cache, { data: { productsEdit } }) => {
        cache.modify({
          id: cache.identify(productsEdit),
          fields: Object.keys(variables || {}).reduce((fields: any, field) => {
            fields[field] = () => (variables || {})[field];
            return fields;
          }, {}),
          optimistic: true,
        });
      },
    });
  };

  return { productsEdit: mutate, loading };
};
