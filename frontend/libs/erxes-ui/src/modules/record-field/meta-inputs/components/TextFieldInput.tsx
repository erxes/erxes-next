import * as React from 'react';
import { Input, InputProps } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

export const TextFieldInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn('h-[34px] w-full rounded-none px-2 focus-visible:invalid:border-destructive  focus-visible:invalid:ring-[3px] focus-visible:invalid:ring-destructive/20', className)}
        {...props}
      />
    );
  }
);

TextFieldInput.displayName = 'TextFieldInput';
