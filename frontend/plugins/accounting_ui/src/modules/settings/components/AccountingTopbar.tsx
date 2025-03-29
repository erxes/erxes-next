import { useLocation } from 'react-router';
import { AddAccount } from '@/account/components/AddAccount';
import { AccountingFilter } from '../../account/components/AccountsFilter';

export const AccountingTopbar = () => {
  const { pathname } = useLocation();

  if (pathname === '/settings/accounting/accounts') {
    return (
      <div className="flex items-center gap-3">
        <AccountingFilter />
        <AddAccount />
      </div>
    );
  }

  return <div>AccountingTopbar</div>;
};
