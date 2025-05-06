import { cn, Form, Input } from 'erxes-ui';
import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Icon, IconLink, IconProps } from '@tabler/icons-react';

type Props<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  description?: string;
  control: Control<T>;
  InputIcon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<Icon>
  >;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const LinkInput = <T extends FieldValues>({
  label,
  name,
  description,
  control,
  InputIcon,
  ...rest
}: Props<T>) => {
  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>{label}</Form.Label>
          <Form.Description>{description}</Form.Description>
          <Form.Control>
            <div className="relative">
              <span className="absolute inset-0 w-8 flex items-center justify-center text-muted-foreground bg-muted rounded-l-sm">
                {InputIcon ? <InputIcon size={16} /> : <IconLink size={16} />}
              </span>
              <Input
                {...field}
                {...rest}
                className={`pl-9 ${rest.className ?? ''}`}
                placeholder={`https://www.${label.toLowerCase()}.com/example`}
              />
            </div>
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};
