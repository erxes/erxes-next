import { DatePicker, Form, Input } from 'erxes-ui';
import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { SelectBranches, SelectDepartments, SelectPositions } from 'ui-modules';

type Props<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  description?: string;
  control: Control<T>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInputField = <T extends FieldValues>({
  label,
  name,
  description,
  control,
  ...rest
}: Props<T>) => {
  if (rest.type === 'date') {
    return (
      <Form.Field
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <Form.Control>
              <DatePicker {...field} onChange={field.onChange} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    );
  } else if (name === 'positionIds') {
    return (
      <Form.Field
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <SelectPositions.FormItem
              mode="multiple"
              value={field.value}
              onValueChange={field.onChange}
            />
            <Form.Message />
          </Form.Item>
        )}
      />
    );
  } else if (name === 'email' || name === 'username') {
    return (
      <Form.Field
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item className="col-span-3">
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <Form.Control>
              <Input {...field} {...rest} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    );
  } else if (name === 'branchIds') {
    return (
      <Form.Field
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <SelectBranches.FormItem
              mode="multiple"
              value={field.value}
              onValueChange={field.onChange}
            />
            <Form.Message />
          </Form.Item>
        )}
      />
    );
  } else if (name === 'departmentIds') {
    return (
      <Form.Field
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <SelectDepartments.FormItem
              mode="multiple"
              value={field.value}
              onValueChange={field.onChange}
            />
            <Form.Message />
          </Form.Item>
        )}
      />
    );
  }
  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field }) => (
        <Form.Item className="col-span-2">
          <Form.Label>{label}</Form.Label>
          <Form.Description>{description}</Form.Description>
          <Form.Control>
            <Input {...field} {...rest} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};
