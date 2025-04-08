import { Form, Select } from 'erxes-ui';
import { TAddTransactionGroup } from '../types/AddTransaction';
import { UseFormReturn } from 'react-hook-form';
import {
  CustomerType,
  SelectCustomer,
  SelectCompany,
  AssignMember,
} from 'ui-modules';

export const CustomerFields = ({
  form,
  index,
}: {
  form: UseFormReturn<TAddTransactionGroup>;
  index: number;
}) => {
  const { customerType } = form.watch(`details.${index}`);

  const SelectComponent =
    customerType === CustomerType.CUSTOMER
      ? SelectCustomer
      : customerType === CustomerType.COMPANY
      ? SelectCompany
      : AssignMember;

  return (
    <>
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
            <Form.Label>{customerType}</Form.Label>
            <Form.Control>
              <SelectComponent
                value={field.value}
                onValueChange={field.onChange}
              />
            </Form.Control>
          </Form.Item>
        )}
      />
    </>
  );
};
