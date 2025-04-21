import { Checkbox, CurrencyValueInput, Form, Input } from 'erxes-ui';
import { ITransactionGroupForm } from '../types/AddTransaction';
import { SelectVat } from '~/modules/vat/components/SelectVat';
import { useWatch } from 'react-hook-form';

export const VatForm = ({
  form,
  journalIndex,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
}) => {
  const hasVat = useWatch({
    control: form.control,
    name: `details.${journalIndex}.hasVat`,
  });

  return (
    <>
      <Form.Field
        control={form.control}
        name={`details.${journalIndex}.hasVat`}
        render={({ field }) => (
          <Form.Item className="flex items-center space-x-2 space-y-0 col-start-1 pt-5">
            <Form.Control>
              <Checkbox
                checked={field.value}
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
            name={`details.${journalIndex}.handleVat`}
            render={({ field }) => (
              <Form.Item className="flex items-center space-x-2 space-y-0 pt-5">
                <Form.Control>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Form.Control>
                <Form.Label variant="peer">Handle VAT</Form.Label>
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name={`details.${journalIndex}.afterVat`}
            render={({ field }) => (
              <Form.Item className="flex items-center space-x-2 space-y-0 pt-5">
                <Form.Control>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Form.Control>
                <Form.Label variant="peer">After VAT</Form.Label>
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name={`details.${journalIndex}.vatRow`}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>VAT row</Form.Label>
                <SelectVat value={field.value} onValueChange={field.onChange} />
                <Form.Message />
              </Form.Item>
            )}
          />
          <VatAmountField form={form} journalIndex={journalIndex} />
        </>
      )}
    </>
  );
};

export const VatAmountField = ({
  form,
  journalIndex,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
}) => {
  const handleVat = useWatch({
    control: form.control,
    name: `details.${journalIndex}.handleVat`,
  });

  return (
    <Form.Field
      control={form.control}
      name={`details.${journalIndex}.vatAmount`}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>VAT amount</Form.Label>
          <CurrencyValueInput
            value={field.value}
            onChange={field.onChange}
            disabled={!handleVat}
          />
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};
