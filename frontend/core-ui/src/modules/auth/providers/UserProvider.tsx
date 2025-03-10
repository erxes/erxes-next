import { Navigate, Outlet } from 'react-router';

import { currentUserState, isCurrentUserLoadedState } from 'ui-modules';

import { RocketIcon } from 'erxes-ui/icons';
import { isDefined } from 'erxes-ui/utils';

import { AppPath } from '@/types/paths/AppPath';
import { useAtomValue } from 'jotai';

export const UserProvider = () => {
  const isCurrentUserLoaded = useAtomValue(isCurrentUserLoadedState);

  const currentUser = useAtomValue(currentUserState);

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
    return <Navigate to={AppPath.Login} replace />;
  }

  return <Outlet />;
};
