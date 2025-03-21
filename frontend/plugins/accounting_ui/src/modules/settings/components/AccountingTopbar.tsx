import { useLocation } from 'react-router';
import { AddAccount } from '@/account/components/AddAccount';
export const AccountingTopbar = () => {
  const { pathname } = useLocation();

  if (pathname === '/settings/accounting/accounts') {
    return <AddAccount />;
  }

  return <div>AccountingTopbar</div>;
};
