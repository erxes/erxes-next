import { Filter, SettingsHeader, Spinner } from 'erxes-ui';
import { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router';
import { AccountingSidebar } from './Sidebar';
import { AccountSettingsBreadcrumb } from './AccountSettingsBreadcrumb';
import { AccountingTopbar } from './AccountingTopbar';

export const AccountingMainConfig = lazy(() =>
  import('~/pages/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
);

export const Accounts = lazy(() =>
  import('~/pages/AccountPage').then((module) => ({
    default: module.AccountPage,
  })),
);

export const AccountCategories = lazy(() =>
  import('~/pages/AccountCategoriesPage').then((module) => ({
    default: module.AccountCategoriesPage,
  })),
);

export const VatRows = lazy(() =>
  import('~/pages/VatRowsPage').then((module) => ({
    default: module.VatRowsPage,
  })),
);

export const CTaxRows = lazy(() =>
  import('~/pages/CTaxRowsPage').then((module) => ({
    default: module.CTaxRowsPage,
  })),
);

const AccountingSettings = () => {
  return (
    <Filter id="accounting-settings">
      <div className="flex flex-col flex-auto overflow-hidden">
        <SettingsHeader breadcrumbs={<AccountSettingsBreadcrumb />}>
          <div className="flex ml-auto">
            <AccountingTopbar />
          </div>
        </SettingsHeader>
        <div className="flex flex-auto overflow-hidden">
          <AccountingSidebar />
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<AccountingMainConfig />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route
                path="/account-categories"
                element={<AccountCategories />}
              />
              <Route path="/vat" element={<VatRows />} />
              <Route path="/ctax" element={<CTaxRows />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Filter>
  );
};

export default AccountingSettings;
