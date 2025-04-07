import { UseFormReturn } from 'react-hook-form';
import { TAddTransactionGroup } from '../types/AddTransaction';

export const BankTransaction = ({
  form,
  index,
}: {
  form: UseFormReturn<TAddTransactionGroup>;
  index: number;
}) => {
  return <div>Bank</div>;
};
