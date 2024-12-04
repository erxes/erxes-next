import { Outlet } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import { isDefined, RocketIcon } from 'erxes-ui';
import { Navigate } from 'react-router-dom';

import { isCurrentOrganizationLoadedState } from '@/organization/states/currentOrganizationLoadingState';
import { currentOrganizationState } from '@/organization/states/currentOrganizationSate';

export const OrganizationProvider = () => {
  const isCurrentOrganizationLoaded = useRecoilValue(
    isCurrentOrganizationLoadedState
  );

  const currentOrganization = useRecoilValue(currentOrganizationState);

  console.log('isCurrentOrganizationLoaded', isCurrentOrganizationLoaded);

  if (!isCurrentOrganizationLoaded) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center">
        <RocketIcon />
        <p className="text-sm text-muted-foreground">
          Hang in there! We'sadssadall be right back with you
        </p>
      </div>
    );
  }

  console.log('currentOrganization', currentOrganization);

  if (isDefined(currentOrganization) && !currentOrganization.haveOwner) {
    return <Navigate to="/create-owner" replace />;
  }

  return <Outlet />;
};
