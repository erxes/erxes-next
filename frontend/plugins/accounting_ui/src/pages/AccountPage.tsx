import { AccountsTable } from '@/account/components/AccountsTable';

export const AccountPage = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden p-3">
      <AccountsTable />
    </div>
  );
};
