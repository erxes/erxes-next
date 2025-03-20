import { PtrRecordTable } from '@/ptr/components/PtrRecordTable';
import { AddTransaction } from '@/ptr/components/AddTransaction';
import { AccountingHeader } from '@/layout/components/Header';
import { AccountingLayout } from '@/layout/components/Layout';
import { Button } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
export const PtrListPage = () => {
  return (
    <AccountingLayout>
      <AccountingHeader>
        <AddTransaction>
          <Button>
            <IconPlus />
            Add Transaction
          </Button>
        </AddTransaction>
      </AccountingHeader>
      <div className="flex-1 px-3">
        <PtrRecordTable />
      </div>
    </AccountingLayout>
  );
};
