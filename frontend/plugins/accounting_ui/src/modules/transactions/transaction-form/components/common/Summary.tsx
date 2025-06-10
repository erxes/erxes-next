import { Button, CurrencyCode, CurrencyFormatedDisplay } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useWatch } from 'react-hook-form';
import { TR_SIDES } from '../../../types/constants';
import { followTrDocsState } from '../../states/trStates';
import { ITransactionGroupForm, TTrDoc } from '../../types/JournalForms';
import { ITransaction } from '~/modules/transactions/types/Transaction';

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

export const sumDtAndCt = (trDocs: TTrDoc[], followTrDocs: ITransaction[]) => {
  const [sumDt, sumCt] = getSum(trDocs || [], 0, 0);
  const [sumDebit, sumCredit] = getSum(followTrDocs, sumDt, sumCt);
  return [sumDebit, sumCredit]
}

export const Summary = ({ form }: { form: ITransactionGroupForm }) => {
  const { trDocs } = useWatch({ control: form.control });
  const [followTrDocs] = useAtom(followTrDocsState);

  const [sumDebit, sumCredit] = sumDtAndCt(trDocs as TTrDoc[], followTrDocs)

  return (
    <div className="flex justify-end items-center col-span-2 xl:col-span-3 gap-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent-foreground">Sum Debit:</span>
        <span className="text-primary font-bold">
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: sumDebit * 1000000,
            }}
          />
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent-foreground">Sum Credit:</span>
        <span className="text-primary font-bold">
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: sumCredit * 1000000,
            }}
          />
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent-foreground">+CT:</span>
        <span className="text-primary font-bold">
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: (sumCredit - sumDebit) * 1000000,
            }}
          />
        </span>
      </div>
      <Button type="submit">Save</Button>
    </div>
  );
};
