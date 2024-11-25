import React from 'react';
import { useRecoilValue } from 'recoil';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const isCurrentUserLoaded = useRecoilValue(isCurrentUserLoadedState);

  const currentUser = useRecoilValue(currentUserState);

  return isCurrentUserLoaded && currentUser && { children };
};
