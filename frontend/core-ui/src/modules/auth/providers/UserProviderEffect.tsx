import { useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import {
  currentUserState,
  isCurrentUserLoadedState,
} from 'erxes-ui-shared-states';

import { isDefined } from 'erxes-ui/utils';

import { currentUser } from '@/users/graphql/queries';
import { useAtom } from 'jotai';

export const UserProviderEffect = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [isCurrentUserLoaded, setIsCurrentUserLoaded] = useAtom(
    isCurrentUserLoadedState
  );

  const setCurrentUser = useAtom(currentUserState);

  const {
    loading: queryLoading,
    data: queryData,
    refetch,
  } = useQuery(currentUser);

  useEffect(() => {
    if (!queryLoading) {
      setIsLoading(false);
      setIsCurrentUserLoaded(true);
    }

    if (!isDefined(queryData?.currentUser)) return;

    setCurrentUser[1](queryData.currentUser);
  }, [
    setCurrentUser,
    isLoading,
    queryLoading,
    queryData?.currentUser,
    setIsCurrentUserLoaded,
    queryData,
  ]);

  useEffect(() => {
    if (!isCurrentUserLoaded) {
      refetch();
    }
  }, [isCurrentUserLoaded, refetch]);

  return null;
};
