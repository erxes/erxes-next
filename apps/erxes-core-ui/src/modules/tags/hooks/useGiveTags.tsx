import { OperationVariables, useMutation } from '@apollo/client';
import { GIVE_TAGS } from '../graphql/mutations/tagsMutations';

export const useGiveTags = (operationVariables?: OperationVariables) => {
  const [giveTags, { loading }] = useMutation(GIVE_TAGS, operationVariables);

  return { giveTags, loading };
};
