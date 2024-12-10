import { useRecoilValue } from 'recoil';

import { Navigate, Outlet } from 'react-router-dom';
import { RocketIcon } from 'erxes-ui/icons';
import { isDefined } from 'erxes-ui/utils';

import {
  isCurrentUserLoadedState,
  currentUserState,
} from 'erxes-shared-states';

export const UserProvider = () => {
  const isCurrentUserLoaded = useRecoilValue(isCurrentUserLoadedState);

  const currentUser = useRecoilValue(currentUserState);

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
