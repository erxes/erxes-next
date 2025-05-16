import { TR_SIDES, TrJournalEnum } from '../../../types/constants';
import { ITransactionGroupForm } from '../../types/AddTransaction';
import { CustomerFields } from './../CustomerFields';
import {
  AccountField,
  AmountField,
  AssignToField,
  BranchField,
  DepartmentField,
  DescriptionField,
  SideField,
} from './../GeneralFormFields';

export const MainJournalForm = ({
  form,
  index,
}: {
  form: ITransactionGroupForm;
  index: number;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
      <AccountField form={form} index={index} journal={TrJournalEnum.MAIN} />
      <SideField form={form} index={index} sides={TR_SIDES.OPTIONS} />
      <AmountField form={form} index={index} />
      <CustomerFields form={form} index={index} />
      <AssignToField form={form} index={index} />
      <BranchField form={form} index={index} />
      <DepartmentField form={form} index={index} />
      <DescriptionField form={form} index={index} />
    </div>
  );
};
