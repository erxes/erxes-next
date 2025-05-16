import { ITransactionGroupForm } from '../../types/AddTransaction';
import {
  AccountField,
  AssignToField,
  BranchField,
  DepartmentField,
  DescriptionField,
} from './../GeneralFormFields';
import { CustomerFields } from './../CustomerFields';
import { InventoryForm } from '../../../inventory/components/InventoryForm';
import { VatForm } from '../TaxForm';
import { TrJournalEnum } from '@/transactions/types/constants';

export const InvIncomeForm = ({
  form,
  index,
}: {
  form: ITransactionGroupForm;
  index: number;
}) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <AccountField form={form} index={index} journal={TrJournalEnum.INVENTORY} />
        <CustomerFields form={form} index={index} />
        <AssignToField form={form} index={index} />
        <BranchField form={form} index={index} />
        <DepartmentField form={form} index={index} />
        <DescriptionField form={form} index={index} />
        <VatForm form={form} journalIndex={index} />
      </div>

      <InventoryForm
        form={form}
        journalIndex={index}
        journal={TrJournalEnum.INV_INCOME}
      />
    </>
  );
};
