import { MutationHookOptions, useMutation } from '@apollo/client';
import { CHANGE_COURSE_STATUS } from '@/courses/graphql/mutations/changeCourseStatus';

export const useChangeCourseStatus = () => {
  const [changeCourseStatus, { loading }] = useMutation(CHANGE_COURSE_STATUS);

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    changeCourseStatus({
      ...options,
      variables,
      update: (cache, { data: { changeCourseStatus } }) => {
        cache.modify({
          id: cache.identify(changeCourseStatus),
          fields: Object.keys(variables || {}).reduce((fields: any, field) => {
            fields[field] = () => (variables || {})[field];
            return fields;
          }, {}),
          optimistic: true,
        });
      },
    });
  };

  return { changeCourseStatus: mutate, loading };
};
