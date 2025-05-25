import { useMainConfigs } from '@/settings/hooks/useMainConfigs';
import { SelectCtax } from '@/settings/ctax/components/SelectCtaxRow';
import { Checkbox, CurrencyField, Form } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { TrJournalEnum, TR_SIDES } from '../../../types/constants';
import { followTrDocsState, taxPercentsState } from '../../states/trStates';
import { ITransactionGroupForm } from '../../types/AddTransaction';
import { ICtaxRow } from '~/modules/settings/ctax/types/CtaxRow';
import { getTempId } from '../utils';
import { ITransaction } from '../../../types/Transaction';

export const CtaxForm = ({
  form,
  journalIndex,
  isWithTax,
  isSameSide
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
  isWithTax?: boolean;
  isSameSide: boolean;
}) => {
  const [taxPercents, setTaxPercents] = useAtom(taxPercentsState);
  const trDoc = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}`
  })
  const ctaxFollowData = (trDoc.follows || []).find(f => f.type === 'ctax');

  const hasCtax = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.hasCtax`
  });

  const mainSide = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details.0.side`
  });

  const side = useMemo(() => {
    if (isSameSide) {
      return mainSide;
    }

    return mainSide === TR_SIDES.DEBIT ? TR_SIDES.CREDIT : TR_SIDES.DEBIT;
  }, [mainSide, isSameSide]);

  const handleCtax = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.handleCtax`,
  });

  const details = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details`
  });

  const { ctax: ctaxPercent = 0, sum: sumPercent } = taxPercents;

  const calcedAmount = useMemo(() => {
    if (handleCtax) {
      return trDoc.ctaxAmount ?? 0;
    }
    const sumAmount = details.filter(d => !d.excludeCtax).reduce((sum, cur) => sum + (cur.amount ?? 0), 0);
    if (isWithTax) {
      return sumAmount / (100 + sumPercent) * ctaxPercent;
    }

    return sumAmount / 100 * ctaxPercent;

  }, [details, handleCtax, ctaxPercent, sumPercent, isWithTax, trDoc.ctaxAmount]);


  const { configs } = useMainConfigs();
  const [followTrDocs, setFollowTrDocs] = useAtom(followTrDocsState);

  useEffect(() => {
    if (!trDoc.hasCtax) {
      form.setValue(`trDocs.${journalIndex}.follows`, trDoc.follows?.filter(f => f.type !== 'ctax'));
      setFollowTrDocs((followTrDocs || []).filter(ftr => !(ftr.originId === trDoc._id && ftr.followType === 'ctax')));
      return;
    }

    if (side === TR_SIDES.DEBIT) {
      form.setValue(`trDocs.${journalIndex}.follows`, trDoc.follows?.filter(f => f.type !== 'ctax'));
      setFollowTrDocs((followTrDocs || []).filter(ftr => !(ftr.originId === trDoc._id && ftr.followType === 'ctax')));
      return;
    }

    const { sumDt, sumCt } = side === TR_SIDES.DEBIT ? { sumDt: calcedAmount, sumCt: 0 } : { sumDt: 0, sumCt: calcedAmount };

    const curr = followTrDocs.find(ftr => ftr._id === ctaxFollowData?.id);

    const ctaxFtr = {
      ...curr || (trDoc as ITransaction),
      _id: curr?._id || getTempId(),
      journal: TrJournalEnum.TAX,
      originId: trDoc._id,
      followType: 'ctax',
      details: [{
        ...(curr?.details || [{}])[0],
        accountId: configs?.CtaxPayableAccount,
        side,
        amount: calcedAmount
      }],

      sumDt,
      sumCt,
    };

    form.setValue(`trDocs.${journalIndex}.follows`, [...(trDoc.follows || []).filter(f => f.type !== 'ctax'), { type: 'ctax', id: ctaxFtr._id }])
    setFollowTrDocs([...(followTrDocs || []).filter(ftr => !(ftr.originId === trDoc._id && ftr.followType === 'ctax')), ctaxFtr]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCtax, side, calcedAmount, configs]);

  const changeCtaxRow = (ctaxRow: ICtaxRow) => {
    const ctaxPercent = ctaxRow.percent ?? 0;
    setTaxPercents({
      ctax: ctaxPercent,
      sum: (taxPercents.ctax ?? 0) + ctaxPercent
    });
  }

  // Тухайн баримт нь өмнө нь НӨАТтай гээгүй бөгөөд байгууллагын тохиргоонд НӨАТгүй гэсэн бол НӨАТ байх ёсгүй
  if (!trDoc.hasCtax && !configs?.HasCtax) {
    return null;
  }

  return (
    <>
      {/* <CtaxEffects form={form} /> */}
      <Form.Field
        control={form.control}
        name={`trDocs.${journalIndex}.hasCtax`}
        render={({ field }) => (
          <Form.Item className="flex items-center space-x-2 space-y-0 col-start-1 pt-5">
            <Form.Control>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </Form.Control>
            <Form.Label variant="peer">Has VAT</Form.Label>
          </Form.Item>
        )}
      />
      {hasCtax && (
        <>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.handleCtax`}
            render={({ field }) => (
              <Form.Item className="flex items-center space-x-2 space-y-0 pt-5">
                <Form.Control>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </Form.Control>
                <Form.Label variant="peer">Handle VAT</Form.Label>
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.ctaxRowId`}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>VAT row</Form.Label>
                <SelectCtax value={field.value || ''} onValueChange={field.onChange} onCallback={changeCtaxRow} />
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.ctaxAmount`}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>VAT amount</Form.Label>
                <CurrencyField.ValueInput
                  value={handleCtax ? field.value ?? 0 : calcedAmount}
                  onChange={field.onChange}
                  disabled={!handleCtax}
                />
                <Form.Message />
              </Form.Item>
            )}
          />
        </>
      )}
    </>
  );
};
