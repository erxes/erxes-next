import React from 'react';
import { useRecoilValue } from 'recoil';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';
import { Loader2Icon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { RocketIcon } from 'erxes-ui';

export const UserProvider = ({ children }: React.PropsWithChildren) => {
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

  // if (!currentUser) {
  //   return <Navigate to="/sign-in" replace />;
  // }

  return children;
};
