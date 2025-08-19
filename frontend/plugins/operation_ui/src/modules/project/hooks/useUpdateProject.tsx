import { useMutation, MutationHookOptions } from '@apollo/client';
import { UPDATE_PROJECT_MUTATION } from '../graphql/mutation/updateProject';
import { useToast } from 'erxes-ui';
export const useUpdateProject = () => {
  const { toast } = useToast();
  const [_updateProject, { loading, error }] = useMutation(
    UPDATE_PROJECT_MUTATION,
  );
  const updateProject = (options: MutationHookOptions) => {
    return _updateProject({
      ...options,
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
      update: (cache, { data }) => {
        try {
          cache.modify({
            id: cache.identify(data?.updateProject),
            fields: Object.keys(options?.variables || {}).reduce(
              (fields: Record<string, () => any>, field) => {
                fields[field] = () => (options?.variables || {})[field];
                return fields;
              },
              {},
            ),
            optimistic: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return { updateProject, loading, error };
};
