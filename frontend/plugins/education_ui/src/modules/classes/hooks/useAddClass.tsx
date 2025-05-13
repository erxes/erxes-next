import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { IClass } from '@/classes/types/type';
import { ADD_CLASS } from '@/classes/graphql/mutations/addClass';
import { GET_CLASSES } from '@/classes/graphql/queries/getClasses';

interface ClassData {
  courseClasses: {
    list: IClass[];
    totalCount: number;
  };
}

interface AddClassResult {
  classAdd: IClass;
}

export function useAddClass(
  options?: MutationHookOptions<AddClassResult, any>,
) {
  const [classAdd, { loading, error }] = useMutation<AddClassResult>(
    ADD_CLASS,
    {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const queryVariables = { perPage: 30 };
          const existingData = cache.readQuery<ClassData>({
            query: GET_CLASSES,
          });
          if (!existingData || !existingData.courseClasses || !data?.classAdd)
            return;

          cache.writeQuery<ClassData>({
            query: GET_CLASSES,
            variables: queryVariables,
            data: {
              courseClasses: {
                ...existingData.courseClasses,
                list: [data.classAdd, ...existingData.courseClasses.list],
                totalCount: existingData.courseClasses.totalCount + 1,
              },
            },
          });
        } catch (e) {
          console.error('error:', e);
        }
      },
    },
  );

  return { classAdd, loading, error };
}
