import { PtrRecordTable } from '@/transactions/components/PtrRecordTable';
import { AddTransaction } from '@/transactions/components/AddTransaction';
import { AccountingHeader } from '@/layout/components/Header';
import { AccountingLayout } from '@/layout/components/Layout';
import { Button } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { TransactionsFilterBar } from '@/transactions/components/FilterBar';
import { TransactionsFilter } from '@/transactions/components/Filter';

export const PtrListPage = () => {
  return (
    <AccountingLayout>
      <AccountingHeader>
        <TransactionsFilter />
        <AddTransaction>
          <Button>
            <IconPlus />
            Add Transaction
          </Button>
        </AddTransaction>
      </AccountingHeader>
      <TransactionsFilterBar />
      <div className="flex-1 px-3">
        <PtrRecordTable />
      </div>
    </AccountingLayout>
  );
};
