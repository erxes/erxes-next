import { TransactionsGroupForm } from '@/transactions/transaction-form/components/TransactionsGroupForm';
import { AccountingLayout } from '@/layout/components/Layout';
import { AccountingHeader } from '@/layout/components/Header';
import { Button } from 'erxes-ui';
import { IconChevronLeft } from '@tabler/icons-react';

export const TransactionPage = () => {
  return (
    <AccountingLayout>
      <AccountingHeader />
      <div className="px-6 py-4">
        <Button variant="ghost" className="text-muted-foreground">
          <IconChevronLeft />
          Return
        </Button>
      </div>
      <TransactionsGroupForm />
    </AccountingLayout>
  );
};
