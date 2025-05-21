import { MutationHookOptions, useMutation } from '@apollo/client';
import { EDIT_TAG } from '../graphql/mutations/tagsMutations';

export const useTagsEdit = () => {
  const [editTagMutation, { loading, error }] = useMutation(EDIT_TAG);

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    editTagMutation({
      ...options,
      variables,
      update: (cache, { data: { tagsEdit } }) => {
        cache.modify({
          id: cache.identify(tagsEdit),
          fields: Object.keys(variables || {}).reduce(
            (fields: Record<string, () => any>, field) => {
              fields[field] = () => (variables || {})[field];
              return fields;
            },
            {},
          ),
          optimistic: true,
        });
      },
    });
  };

  return { tagsEdit: mutate, loading, error };
};
