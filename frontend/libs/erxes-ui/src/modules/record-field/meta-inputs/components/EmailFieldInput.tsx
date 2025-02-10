import * as React from 'react';
import { Input, InputProps } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { isValidEmail } from 'erxes-ui/utils';

export const EmailFieldInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState(true);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(isValidEmail(newValue));
      onChange && onChange(e);
      
    };

    return (
      <Input
        ref={ref}
        className={cn(
          'h-[34px] w-full rounded-none px-2',
          !isValid &&
            'focus-visible:ring-destructive/20 focus-visible:ring-[3px] focus-visible:border-destructive',
          className,
        )}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

EmailFieldInput.displayName = 'EmailFieldInput';
