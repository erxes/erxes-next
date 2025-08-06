import { useMutation, MutationHookOptions } from '@apollo/client';
import { UPDATE_PROJECT_MUTATION } from '../graphql/mutation/updateProject';

export const useUpdateProject = () => {
  const [_updateProject, { loading, error }] = useMutation(
    UPDATE_PROJECT_MUTATION,
  );
  const updateProject = (options: MutationHookOptions) => {
    return _updateProject({
      ...options,
      update: (cache, { data }) => {
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
      },
    });
  };

  return { updateProject, loading, error };
};
