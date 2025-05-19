import { Button } from 'erxes-ui';
import { useWatch } from 'react-hook-form';
import { TR_SIDES } from '../../types/constants';
import { ITransactionGroupForm } from '../types/AddTransaction';

export const Summary = ({ form }: { form: ITransactionGroupForm }) => {
  const { trDocs } = useWatch({ control: form.control });
  const sumDebit =
    trDocs?.reduce((acc, curr) => {
      return (
        acc + (
          curr && curr.details && curr?.details[0]?.side === TR_SIDES.DEBIT ? (curr?.details[0]?.amount ?? 0) : 0
        )
      );
    }, 0) ?? 0;

  const sumCredit =
    trDocs?.reduce((acc, curr) => {
      return (
        acc + (
          curr && curr.details && curr?.details[0]?.side === TR_SIDES.CREDIT ? (curr?.details[0]?.amount ?? 0) : 0
        )
      );
    }, 0) ?? 0;

  return (
    <div className="flex justify-end items-center col-span-2 xl:col-span-3 gap-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent-foreground">Sum Debit:</span>
        <span className="text-primary font-bold">{sumDebit}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent-foreground">Sum Credit:</span>
        <span className="text-primary font-bold">{sumCredit}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent-foreground">+CT:</span>
        <span className="text-primary font-bold">{sumCredit - sumDebit}</span>
      </div>
      <Button type="submit">Save</Button>
    </div>
  );
};
