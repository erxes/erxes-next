import { CurrencyValueInput, Form, Select, Textarea } from 'erxes-ui';
import { UseFormReturn } from 'react-hook-form';
import { TAddTransactionGroup } from '../types/AddTransaction';
import { SelectAccount } from '@/account/components/SelectAccount';
import { CustomerType, SelectCustomer } from 'ui-modules';

export const MainJournalForm = ({
  form,
  index,
}: {
  form: UseFormReturn<TAddTransactionGroup>;
  index: number;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
      <Form.Field
        control={form.control}
        name={`details.${index}.accountId`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Account</Form.Label>
            <Form.Control>
              <SelectAccount
                value={field.value}
                onChange={field.onChange}
                journal="main"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name={`details.${index}.side`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Side</Form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <Form.Control>
                <Select.Trigger>
                  <Select.Value placeholder="Select Account" />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                <Select.Item value="dt">Debit</Select.Item>
                <Select.Item value="ct">Credit</Select.Item>
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name={`details.${index}.amount`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Amount</Form.Label>
            <Form.Control>
              <CurrencyValueInput
                value={field.value}
                onChange={field.onChange}
              />
            </Form.Control>
          </Form.Item>
        )}
      />

      <Form.Field
        control={form.control}
        name={`details.${index}.customerType`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Customer Type</Form.Label>

            <Select value={field.value} onValueChange={field.onChange}>
              <Form.Control>
                <Select.Trigger>
                  <Select.Value placeholder="Select Customer Type" />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {Object.values(CustomerType).map((type) => (
                  <Select.Item key={type} value={type}>
                    {type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name={`details.${index}.customerId`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Customer</Form.Label>
            <Form.Control>
              <SelectCustomer
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name={`details.${index}.description`}
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Textarea value={field.value} onChange={field.onChange} />
            </Form.Control>
          </Form.Item>
        )}
      />
    </div>
  );
};
