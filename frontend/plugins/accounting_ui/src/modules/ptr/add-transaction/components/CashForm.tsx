import { UseFormReturn } from 'react-hook-form';
import { TAddTransactionGroup } from '../types/AddTransaction';
import { SelectAccount } from '@/account/components/SelectAccount';
import { CurrencyInput, CurrencyCode, Select, Form, Textarea } from 'erxes-ui';
import { AssignMember, SelectBranch } from 'ui-modules';

export const CashTransaction = ({
  form,
  index,
}: {
  form: UseFormReturn<TAddTransactionGroup>;
  index: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
      <Form.Field
        control={form.control}
        name={`details.${index}.accountId`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Cash Account</Form.Label>
            <Form.Control>
              <SelectAccount
                value={field.value}
                onChange={field.onChange}
                journal="cash"
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
                <Select.Trigger className="h-8">
                  <Select.Value />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                <Select.Item value="incoming">Incoming</Select.Item>
                <Select.Item value="outgoing">Outgoing</Select.Item>
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
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                currencyCode={CurrencyCode.MNT}
                displayCurrency="code"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name={`details.${index}.assignedUserIds`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Assign To</Form.Label>
            <Form.Control>
              <AssignMember
                onValueChange={(user) => field.onChange(user)}
                value={field.value}
                className="w-full flex h-8"
                size="lg"
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
            <Form.Control>
              <Select value={field.value} onValueChange={field.onChange}>
                <Form.Control>
                  <Select.Trigger className="h-8">
                    <Select.Value />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  <Select.Item value="customer">Customer</Select.Item>
                  <Select.Item value="company">Company</Select.Item>
                  <Select.Item value="user">Team member</Select.Item>
                </Select.Content>
              </Select>
            </Form.Control>
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
              <AssignMember
                onValueChange={(user) => field.onChange(user)}
                value={field.value}
                className="w-full flex h-8"
                size="lg"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name={`details.${index}.branchId`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Branch</Form.Label>
            <Form.Control>
              <SelectBranch
                value={field.value}
                onValueChange={(branch) => field.onChange(branch)}
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
              <Textarea {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
    </div>
  );
};
