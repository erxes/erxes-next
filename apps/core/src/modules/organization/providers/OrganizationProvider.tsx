import { Outlet } from 'react-router';

import { useRecoilValue } from 'recoil';
import { RocketIcon } from 'erxes-ui/icons';
import { isDefined } from 'erxes-ui/utils';
import { Navigate } from 'react-router';

import {
  isCurrentOrganizationLoadedState,
  currentOrganizationState,
} from 'erxes-shared-states';

export const OrganizationProvider = () => {
  const isCurrentOrganizationLoaded = useRecoilValue(
    isCurrentOrganizationLoadedState
  );

  const currentOrganization = useRecoilValue(currentOrganizationState);

  if (!isCurrentOrganizationLoaded && !isDefined(currentOrganization)) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center">
        <RocketIcon />
        <p className="text-sm text-muted-foreground">
          Hang in there! We'll be right back with you
        </p>
      </div>
    );
  }

  if (isDefined(currentOrganization) && !currentOrganization.haveOwner) {
    return <Navigate to="/create-owner" replace />;
  }

  return <Outlet />;
};
