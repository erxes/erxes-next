import { Button } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useWatch } from 'react-hook-form';
import { TR_SIDES } from '../../../types/constants';
import { followTrDocsState } from '../../states/trStates';
import { ITransactionGroupForm } from '../../types/AddTransaction';

const getSum = (trDocs: any[], sumDebit: number, sumCredit: number) => {
  trDocs?.forEach((tr) => {
    if (!(tr?.details && tr?.details[0])) {
      return;
    }

    if (tr?.details[0]?.side === TR_SIDES.DEBIT) {
      sumDebit += tr?.details[0]?.amount ?? 0;
    } else {
      sumCredit += tr?.details[0]?.amount ?? 0;
    }
  });
  return [sumDebit, sumCredit];
}

export const Summary = ({ form }: { form: ITransactionGroupForm }) => {
  const { trDocs } = useWatch({ control: form.control });
  const [followTrDocs] = useAtom(followTrDocsState);

  const [sumDt, sumCt] = getSum(trDocs || [], 0, 0);
  const [sumDebit, sumCredit] = getSum(followTrDocs, sumDt, sumCt);

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
