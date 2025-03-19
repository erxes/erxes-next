import { IconCashBanknoteFilled } from '@tabler/icons-react';
import { Button, Separator, SettingsHeader, Spinner } from 'erxes-ui';
import { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router';
import { AccountingSidebar } from './Sidebar';

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

const AccountingSettings = () => {
  return (
    <div className="flex flex-col flex-auto">
      <SettingsHeader>
        <Button variant="ghost" className="font-semibold">
          <IconCashBanknoteFilled className="w-4 h-4 text-accent-foreground" />
          Accounting
        </Button>
        <Separator.Inline />
        <Button variant="ghost" className="font-semibold">
          Main Config
        </Button>
      </SettingsHeader>
      <div className="flex h-full">
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
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default AccountingSettings;
