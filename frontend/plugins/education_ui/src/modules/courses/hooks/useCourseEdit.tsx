import { MutationHookOptions, useMutation } from '@apollo/client';
import { EDIT_COURSE } from '@/courses/graphql/mutations/editCourse';

export const useCourseEdit = () => {
  const [courseEdit, { loading }] = useMutation(EDIT_COURSE);

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    courseEdit({
      ...options,
      variables,
      update: (cache, { data: { courseEdit } }) => {
        cache.modify({
          id: cache.identify(courseEdit),
          fields: Object.keys(variables || {}).reduce((fields: any, field) => {
            fields[field] = () => (variables || {})[field];
            return fields;
          }, {}),
          optimistic: true,
        });
      },
    });
  };

  return { courseEdit: mutate, loading };
};
