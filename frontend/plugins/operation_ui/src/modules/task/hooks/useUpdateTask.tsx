import { useMutation, MutationHookOptions } from '@apollo/client';
import { UPDATE_TASK_MUTATION } from '@/task/graphql/mutations/updateTask';
import { useToast } from 'erxes-ui';
export const useUpdateTask = () => {
  const { toast } = useToast();
  const [_updateTask, { loading, error }] = useMutation(UPDATE_TASK_MUTATION);
  const updateTask = (options: MutationHookOptions) => {
    return _updateTask({
      ...options,
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
      update: (cache, { data }) => {
        cache.modify({
          id: cache.identify(data?.updateTask),
          fields: Object.keys(options?.variables || {}).reduce(
            (fields: Record<string, () => any>, field) => {
              fields[field] = () => (options?.variables || {})[field];
              return fields;
            },
            {},
          ),
          optimistic: true,
        });
      },
    });
  };

  return { updateTask, loading, error };
};
