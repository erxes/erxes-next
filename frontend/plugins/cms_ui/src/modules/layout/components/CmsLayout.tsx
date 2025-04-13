import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { CmsHeader } from './CmsHeader';
import { CmsSideBar } from '~/modules/cms/components/CmsSidebar';

export const CmsLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  const hideSidebar =
    location.pathname.endsWith('/create-post') ||
    location.pathname.endsWith('/cms');

  return (
    <div>
      <CmsHeader />
      <div className="flex">
        {!hideSidebar && <CmsSideBar />}
        {children}
      </div>
    </div>
  );
};
