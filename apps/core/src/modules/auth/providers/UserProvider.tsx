import { useRecoilValue } from 'recoil';
import { isDefined, RocketIcon } from 'erxes-ui';
import { Navigate, Outlet } from 'react-router-dom';

import { isCurrentUserLoadedState } from 'erxes-ui/states/isCurrentUserLoadingState';
import { currentUserState } from 'erxes-ui/states/currentUserState';

export const UserProvider = () => {
  const isCurrentUserLoaded = useRecoilValue(isCurrentUserLoadedState);

  const currentUser = useRecoilValue(currentUserState);

  console.log('currentUser', currentUser);

  if (!isCurrentUserLoaded) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center">
        <RocketIcon />
        <p className="text-sm text-muted-foreground">
          Hang in there! We'll be right back with you
        </p>
      </div>
    );
  }

  if (!isDefined(currentUser)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
