import { Outlet } from 'react-router';
import { Navigate } from 'react-router';

import {
  currentOrganizationState,
  isCurrentOrganizationLoadedState,
} from 'erxes-shared-states';
import { useRecoilValue } from 'recoil';

import { RocketIcon } from 'erxes-ui/icons';
import { isDefined } from 'erxes-ui/utils';

import { AppPath } from '@/types/AppPath';

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

  if (isDefined(currentOrganization) && !currentOrganization.hasOwner) {
    return <Navigate to={AppPath.CreateOwner} replace />;
  }

  // if (isDefined(currentOrganization)) {
  //   const link = document.createElement('link');
  //   link.id = 'favicon';
  //   link.rel = 'shortcut icon';

  //   link.href =
  //     'https://static-00.iconduck.com/assets.00/file-type-favicon-icon-2048x2048-q7lmo5fn.png';

  //   document.head.appendChild(link);
  // }

  return <Outlet />;
};
