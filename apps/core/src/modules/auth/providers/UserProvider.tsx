import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate, useLocation } from 'react-router-dom';
import { isDefined, RocketIcon } from 'erxes-ui';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const isCurrentUserLoaded = useRecoilValue(isCurrentUserLoadedState);
  const currentUser = useRecoilValue(currentUserState);
  const location = useLocation();

  if (!isCurrentUserLoaded) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center">
        <RocketIcon />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }
  if (!isDefined(currentUser) && location.pathname !== '/sign-in') {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};
