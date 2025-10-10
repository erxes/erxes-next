import { useMutation } from '@apollo/client';
import { UOMS_ADD_MUTATION } from '@/products/graphql/UomsMutations';
import { IUom } from 'ui-modules';
import { MutationFunctionOptions } from '@apollo/client';
import { toast } from 'erxes-ui';

export const useAddUoms = (options?: MutationFunctionOptions<IUom>) => {
  const [_addUoms, { loading, error }] = useMutation(UOMS_ADD_MUTATION);

  const addUoms = () => {
    _addUoms({
      ...options,
      onCompleted: (data) => {
        toast({ title: 'Uom has been updated', variant: 'default' });
        options?.onCompleted?.(data);
      },
      onError: (error) => {
        toast({
          title: 'Failed to create uom',
          description: error.message,
          variant: 'destructive',
        });
        options?.onError?.(error);
      },
    });
  };
  return { addUoms, loading, error };
};
