import { TransactionForm } from '~/modules/ptr/add-transaction/components/TransactionForm';
import { AccountingLayout } from '@/layout/components/Layout';
import { AccountingHeader } from '@/layout/components/Header';

export const TransactionPage = () => {
  return (
    <AccountingLayout>
      <AccountingHeader />

      <TransactionForm />
    </AccountingLayout>
  );
};
