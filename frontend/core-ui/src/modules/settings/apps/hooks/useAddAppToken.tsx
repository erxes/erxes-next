import { ADD_TOKEN } from '@/settings/apps/graphql/mutations';
import { IApp } from '@/settings/apps/types';
import { MutationFunctionOptions, useMutation } from '@apollo/client';

interface IResult {
  appsAdd: IApp;
}

export const useAddAppToken = () => {
  const [mutate, { loading, error }] = useMutation<IResult>(ADD_TOKEN);
  return {
    appsAdd: mutate,
    loading,
    error,
  };
};
