import { Navigate, Outlet } from 'react-router';

import {
  currentUserState,
  isCurrentUserLoadedState,
} from 'erxes-ui-shared-states';

import { RocketIcon } from 'erxes-ui/icons';
import { isDefined } from 'erxes-ui/utils';

import { AppPath } from '@/types/paths/AppPath';
import { useAtom } from 'jotai';

export const UserProvider = () => {
  const isCurrentUserLoaded = useAtom(isCurrentUserLoadedState);

  const currentUser = useAtom(currentUserState);

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
