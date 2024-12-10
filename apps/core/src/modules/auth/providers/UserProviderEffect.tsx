import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { isDefined } from 'erxes-ui/utils';
import { useQuery } from '@apollo/client';
import { currentUser } from '@/users/graphql/queries';

import {
  isCurrentUserLoadedState,
  currentUserState,
} from 'erxes-shared-states';

export const UserProviderEffect = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [isCurrentUserLoaded, setIsCurrentUserLoaded] = useRecoilState(
    isCurrentUserLoadedState
  );

  const setCurrentUser = useSetRecoilState(currentUserState);

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

    setCurrentUser(queryData.currentUser);
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
