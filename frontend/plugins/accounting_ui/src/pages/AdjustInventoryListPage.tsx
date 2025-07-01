import { AdjustTable } from '@/adjustments/inventories/components/AdjustTable';
import { AddTransaction } from '@/transactions/components/AddTransaction';
import { AccountingLayout } from '@/layout/components/Layout';
import { Button } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { TransactionsFilterBar } from '@/transactions/components/TrListFilterBar';
import { TransactionsFilter } from '@/transactions/components/TrFilters';
import { AdjustmentHeader } from '../modules/adjustments/components/Header';

export const AdjustInventoryListPage = () => {
  return (
    <AccountingLayout>
      <AdjustmentHeader>
        <div className="px-3">
          <TransactionsFilter />
          <AddTransaction>
            <Button>
              <IconPlus />
              Add Inventory Adjustment
            </Button>
          </AddTransaction>
        </div>
      </AdjustmentHeader>
      <TransactionsFilterBar />
      <AdjustTable />
    </AccountingLayout>
  );
};
