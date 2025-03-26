import { AccountsTable } from '@/account/components/AccountsTable';
import { EditAccount } from '@/account/components/EditAccount';
export const AccountPage = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden p-3 flex-auto">
      <AccountsTable />
      <EditAccount />
    </div>
  );
};
