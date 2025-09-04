import React from 'react';
import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { REMOVE_TOKEN } from '../graphql/mutations';
import { toast } from 'erxes-ui';

interface IRemoveResults {
  appsRemove: boolean;
}

const useRemoveToken = () => {
  const [mutate, { loading, error }] =
    useMutation<IRemoveResults>(REMOVE_TOKEN);

  const handleRemoveToken = (
    options: MutationFunctionOptions<IRemoveResults, any>,
  ) => {
    return mutate({
      ...options,
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
      refetchQueries: ['Apps'],
    });
  };
  return {
    appsRemove: handleRemoveToken,
    loading,
    error,
  };
};

export default useRemoveToken;
