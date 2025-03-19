import { useAccounts } from '@/account/hooks/useAccounts';

export const AccountsTable = () => {
  const { accounts, loading, error } = useAccounts();
  return <div>AccountsTable</div>;
};
