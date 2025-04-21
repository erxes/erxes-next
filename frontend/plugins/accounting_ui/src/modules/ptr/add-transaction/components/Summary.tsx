import { Button } from 'erxes-ui';
import { useWatch } from 'react-hook-form';
import { ITransactionGroupForm } from '../types/AddTransaction';

export const Summary = ({ form }: { form: ITransactionGroupForm }) => {
  const { details } = useWatch({ control: form.control });
  const sumDebit =
    details?.reduce((acc, curr) => {
      return (
        acc +
        (['dt', 'incoming'].includes(curr?.side || '') ? curr?.amount ?? 0 : 0)
      );
    }, 0) ?? 0;

  const sumCredit =
    details?.reduce((acc, curr) => {
      return (
        acc +
        (['ct', 'outgoing'].includes(curr?.side || '') ? curr?.amount ?? 0 : 0)
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
