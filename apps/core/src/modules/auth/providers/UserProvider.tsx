import React from 'react';
import { useRecoilValue } from 'recoil';
// import { Navigate, useLocation } from 'react-router-dom';
import { isDefined, RocketIcon } from 'erxes-ui';
import { Navigate, Outlet } from 'react-router-dom';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';

export const UserProvider = () => {
  const isCurrentUserLoaded = useRecoilValue(isCurrentUserLoadedState);

  const currentUser = useRecoilValue(currentUserState);

  if (!isCurrentUserLoaded) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center">
        <RocketIcon />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isDefined(currentUser)) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};
