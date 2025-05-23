import { Outlet, Navigate } from 'react-router';
import { useAtom } from 'jotai';

import {
  clientConfigApiStatusState,
  currentOrganizationState,
  isCurrentOrganizationLoadedState,
} from 'ui-modules';

import { RocketIcon, isDefined } from 'erxes-ui';

import { ClientConfigError } from '@/error-handler/components/ClientConfigError';
import { AppPath } from '@/types/paths/AppPath';

export const OrganizationProvider = () => {
  const [isCurrentOrganizationLoaded] = useAtom(
    isCurrentOrganizationLoadedState,
  );
  const [clientConfigApiStatus] = useAtom(clientConfigApiStatusState);
  const [currentOrganization] = useAtom(currentOrganizationState);

  if (clientConfigApiStatus.isErrored) {
    return <ClientConfigError error={clientConfigApiStatus.error} />;
  }

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
