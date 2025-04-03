import { useLocation } from 'react-router';
import { AddAccount } from '@/account/components/AddAccount';
import { AccountingFilter } from '@/account/components/AccountsFilter';
import { AddAccountCategory } from '@/account/account-categories/components/AddAccountCategory';
import { AddVats } from '@/vat/components/AddVats';
import { AddCTax } from '@/ctax/components/AddCTax';

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

  if (pathname === '/settings/accounting/account-categories') {
    return (
      <div className="flex items-center gap-3">
        <AddAccountCategory />
      </div>
    );
  }

  if (pathname === '/settings/accounting/vat') {
    return (
      <div className="flex items-center gap-3">
        <AddVats />
      </div>
    );
  }

  if (pathname === '/settings/accounting/ctax') {
    return (
      <div className="flex items-center gap-3">
        <AddCTax />
      </div>
    );
  }

  return <div>AccountingTopbar</div>;
};
