import { AccountingLayout } from '@/layout/components/Layout';
import { AccountingHeader } from '@/layout/components/Header';
import { AdjustInventoryForm } from '@/adjustments/inventories/components/AdjustInventoryForm';

export const AdjustInventoryFormPage = () => {
  return (
    <AccountingLayout>
      <AccountingHeader />
      <AdjustInventoryForm />
    </AccountingLayout>
  );
};
