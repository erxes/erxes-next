import { CustomerFields } from '../../helpers/CustomerFields';
import { ITransactionGroupForm } from '../../../types/JournalForms';
import { TrJournalEnum } from '@/transactions/types/constants';
import { VatForm } from '../../helpers/VatForm';
import {
  AccountField,
  AssignToField,
  BranchField,
  DepartmentField,
  DescriptionField,
} from '../../GeneralFormFields';
import { InventoryForm } from './InventoryForm';
import { CtaxForm } from '../../helpers/CtaxForm';
import { ExpenseForm } from './ExpenseForm';
// import { InventoryForm } from '../../../inventory/components/InventoryForm';

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
        <AccountField form={form} index={index} filter={{ journals: [TrJournalEnum.INVENTORY] }} allDetails={true} />
        <CustomerFields form={form} index={index} />
        <AssignToField form={form} index={index} />
        <BranchField form={form} index={index} />
        <DepartmentField form={form} index={index} />
        <DescriptionField form={form} index={index} />
        <VatForm form={form} journalIndex={index} isWithTax={false} isSameSide={true} />
        <CtaxForm form={form} journalIndex={index} isWithTax={false} isSameSide={true} />
      </div>

      <div className=" pt-3">
        <ExpenseForm form={form} journalIndex={index} />
      </div>

      <div className='-mt-3'>
        <InventoryForm
          form={form}
          journalIndex={index}
        />
      </div>
    </>
  );
};
