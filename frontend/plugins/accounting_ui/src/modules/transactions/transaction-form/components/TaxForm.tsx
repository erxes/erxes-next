import { useMainConfigs } from '@/settings/hooks/useMainConfigs';
import { SelectVat } from '@/settings/vat/components/SelectVatRow';
import { Checkbox, CurrencyField, Form } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { TR_SIDES } from '../../types/constants';
import { followTrDocsState, taxPercentsState } from '../states/trStates';
import { ITransactionGroupForm } from '../types/AddTransaction';
import { IVatRow } from '~/modules/settings/vat/types/VatRow';

export const VatAmountField = ({
  form,
  journalIndex,
  isWithTax,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
  isWithTax?: boolean;
}) => {
  const handleVat = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.handleVat`,
  });

  const details = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details`
  });

  const [taxPercents] = useAtom(taxPercentsState);

  const { vat: vatPercent = 0, sum: sumPercent } = taxPercents;

  const calcedAmount = useMemo(() => {
    if (handleVat) {
      return 0;
    }
    const sumAmount = details.filter(d => !d.excludeVat).reduce((sum, cur) => sum + (cur.amount ?? 0), 0);
    if (isWithTax) {
      return sumAmount / (100 + sumPercent) * vatPercent;
    }

    return sumAmount / 100 * vatPercent;

  }, [details, handleVat, vatPercent, sumPercent, isWithTax]);

  return (
    <Form.Field
      control={form.control}
      name={`trDocs.${journalIndex}.vatAmount`}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>VAT amount</Form.Label>
          <CurrencyField.ValueInput
            value={handleVat ? field.value ?? 0 : calcedAmount}
            onChange={field.onChange}
            disabled={!handleVat}
          />
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const TaxForm = ({
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
  const trDoc = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}`
  })

  const hasVat = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.hasVat`
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

  const { configs } = useMainConfigs();
  const [followTrDocs, setFollowTrDocs] = useAtom(followTrDocsState);
  const [taxPercents, setTaxPercents] = useAtom(taxPercentsState);

  const vatFollowTrDoc = useMemo(() => {

    if (!trDoc.hasVat) {
      return;
    }
    // form.setValue()
    return {
      // transaction followTrNegTolhiol
    };
  }, [trDoc.hasVat])

  // useEffect(() => {
  //   if (vatFollowTrDoc) {
  //     form.setValue(`trDocs.${journalIndex}.follows`, [trDoc.follows.filter(type !== 'vat'), { type: 'vat', id: '' }])
  //     setFollowTrDocs([...followTrDocs.filter(f => f.originId === trDoc.follows)])
  //     follows: { type: 'vat', _id: followTrDocs[vat]._id }
  //     // } else {

  //     // }


  //   }, [hasVat, hasCtax, side]);

  const changeVatRow = (vatRow: IVatRow) => {
    const vatPercent = vatRow.percent ?? 0;
    setTaxPercents({
      vat: vatPercent,
      sum: (taxPercents.ctax ?? 0) + vatPercent
    });
  }

  // Тухайн баримт нь өмнө нь НӨАТтай гээгүй бөгөөд байгууллагын тохиргоонд НӨАТгүй гэсэн бол НӨАТ байх ёсгүй
  if (!trDoc.hasVat && !configs?.HasVat) {
    return null;
  }

  return (
    <>
      {/* <VatEffects form={form} /> */}
      <Form.Field
        control={form.control}
        name={`trDocs.${journalIndex}.hasVat`}
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
      {hasVat && (
        <>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.handleVat`}
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
            name={`trDocs.${journalIndex}.afterVat`}
            render={({ field }) => (
              <Form.Item className="flex items-center space-x-2 space-y-0 pt-5">
                <Form.Control>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </Form.Control>
                <Form.Label variant="peer">After VAT</Form.Label>
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.vatRowId`}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>VAT row</Form.Label>
                <SelectVat value={field.value || ''} onValueChange={field.onChange} onCallback={changeVatRow} />
                <Form.Message />
              </Form.Item>
            )}
          />
          <VatAmountField form={form} journalIndex={journalIndex} isWithTax={isWithTax} />
        </>
      )}
    </>
  );
};
