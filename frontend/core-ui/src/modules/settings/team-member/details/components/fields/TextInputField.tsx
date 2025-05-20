import dayjs from 'dayjs';
import { DatePicker, Form, Input } from 'erxes-ui';
import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { SelectPosition } from 'ui-modules/modules/structure/components/SelectPosition';

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
          <Form.Item>
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <Form.Control>
              <DatePicker {...field} onChange={field.onChange} />
            </Form.Control>
          </Form.Item>
        )}
      />
    );
  } else if (name === 'details.position') {
    return (
      <Form.Field
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{label}</Form.Label>
            <Form.Description>{description}</Form.Description>
            <Form.Control>
              <SelectPosition
                value={field.value}
                onValueChange={field.onChange}
              />
            </Form.Control>
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
        <Form.Item>
          <Form.Label>{label}</Form.Label>
          <Form.Description>{description}</Form.Description>
          <Form.Control>
            <Input {...field} {...rest} />
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};
