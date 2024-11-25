import React from 'react';
import { useRecoilValue } from 'recoil';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { AuthContext } from '@/auth/contexts/AuthContext';
import { currentUserState } from '@/auth/states/currentUserState';

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const isCurrentUserLoaded = useRecoilValue(isCurrentUserLoadedState);

  const currentUser = useRecoilValue(currentUserState);

  console.log(currentUser);

  return (
    isCurrentUserLoaded &&
    currentUser && (
      <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
    )
  );
};
