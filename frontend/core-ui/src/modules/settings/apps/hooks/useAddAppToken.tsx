import { ADD_TOKEN } from '@/settings/apps/graphql/mutations';
import { IApp } from '@/settings/apps/types';
import { MutationFunctionOptions, useMutation } from '@apollo/client';

interface IResult {
  appsAdd: IApp;
}

export const useAddAppToken = () => {
  const [mutate, { loading, error }] = useMutation<IResult>(ADD_TOKEN);
  const handleAdd = (options?: MutationFunctionOptions<IResult, any>) => {
    mutate({
      ...options,
      onCompleted: (data) => {
        options?.onCompleted?.(data);
      },
      refetchQueries: ['Apps'],
    });
  };
  return {
    appsAdd: handleAdd,
    loading,
    error,
  };
};
