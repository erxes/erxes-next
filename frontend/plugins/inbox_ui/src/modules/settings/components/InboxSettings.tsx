import { Filter, SettingsHeader, Spinner } from 'erxes-ui';
import { lazy, Suspense } from 'react';
import { InboxSettingsBreadcrumb } from './InboxSettingsBreadcrumb';
import { InboxSettingsTopbar } from './InboxSettingsTopbar';
import { InboxSettingsSidebar } from './Sidebar';
import { Route, Routes } from 'react-router';

export const InboxMainConfig = lazy(() =>
  import('~/pages/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
);

const InboxSettings = () => {
  return (
    <Filter id="inbox-settings">
      <div className="flex flex-col flex-auto overflow-hidden">
        <SettingsHeader breadcrumbs={<InboxSettingsBreadcrumb />}>
          <div className="flex ml-auto">
            <InboxSettingsTopbar />
          </div>
        </SettingsHeader>
        <div className="flex flex-auto overflow-hidden">
          <InboxSettingsSidebar />
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<InboxMainConfig />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Filter>
  );
};

export default InboxSettings;
