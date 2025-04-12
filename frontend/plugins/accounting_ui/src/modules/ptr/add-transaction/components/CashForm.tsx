import { ITransactionGroupForm } from '../types/AddTransaction';
import { CustomerFields } from './CustomerFields';
import {
  AccountField,
  AmountField,
  AssignToField,
  BranchField,
  DepartmentField,
  DescriptionField,
  SideField,
} from './GeneralFormFields';
import { SIDES } from '../contants/journalSides';
import { JournalEnum } from '@/account/type/Account';
import { VatForm } from './VatForm';

export const CashTransaction = ({
  form,
  index,
}: {
  form: ITransactionGroupForm;
  index: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
      <AccountField form={form} index={index} journal={JournalEnum.CASH} />
      <SideField form={form} index={index} sides={SIDES.INOUT} />
      <AmountField form={form} index={index} />
      <CustomerFields form={form} index={index} />
      <AssignToField form={form} index={index} />
      <BranchField form={form} index={index} />
      <DepartmentField form={form} index={index} />
      <DescriptionField form={form} index={index} />
      <VatForm form={form} journalIndex={index} />
    </div>
  );
};
