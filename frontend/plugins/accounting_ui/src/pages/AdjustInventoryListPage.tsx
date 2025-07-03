import { AdjustTable } from '@/adjustments/inventories/components/AdjustTable';
import { Link } from 'react-router-dom';
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
          <Link to={`/accounting/adjustment/inventory/create`}>
            <Button>
              <IconPlus />
              Add Inventory Adjustment
            </Button>
          </Link>

        </div>
      </AdjustmentHeader>
      <TransactionsFilterBar />
      <AdjustTable />
    </AccountingLayout>
  );
};
