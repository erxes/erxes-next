import { OperationVariables, useQuery } from '@apollo/client';

import { GET_CHANNELS } from '~/modules/inbox/conversations/graphql/queries/getChannels';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';

export const useChannels = (options?: OperationVariables) => {
  const currentUser = useAtomValue(currentUserState);

  const { data, loading } = useQuery(GET_CHANNELS, {
    ...options,
    variables: {
      memberIds: [currentUser?._id],
      ...options?.variables,
    },
  });

  return { channels: data?.channelsByMembers, loading };
};
