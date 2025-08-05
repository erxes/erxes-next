import { useMutation } from '@apollo/client';
import { DELETE_STATUS } from '../graphql/mutations/deleteStatus';
import { MutationHookOptions } from '@apollo/client';
import { GET_STATUSES_BY_TYPE } from '../graphql/queries/getStatusesByType';

export const useDeleteStatus = () => {
  const [_deleteStatus] = useMutation(DELETE_STATUS);
  const deleteStatus = (options: MutationHookOptions) => {
    return _deleteStatus({
      ...options,
      refetchQueries: [GET_STATUSES_BY_TYPE],
    });
  };
  return deleteStatus;
};
