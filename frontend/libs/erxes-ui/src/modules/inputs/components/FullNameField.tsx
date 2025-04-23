import { cn } from 'erxes-ui/lib/utils';
import { Input } from 'erxes-ui/components';
import { forwardRef } from 'react';

export const FullNameRoot = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn('flex -space-x-px', className)} />
  );
});
FullNameRoot.displayName = 'FullNameRoot';

export const FullNameInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    roudedSide?: 'left' | 'right' | 'none';
  }
>(({ className, roudedSide = 'left', ...props }, ref) => {
  return (
    <Input
      ref={ref}
      {...props}
      className={cn(
        'focus-visible:z-10 max-w-36',
        roudedSide === 'left' && 'rounded-r-none',
        roudedSide === 'right' && 'rounded-l-none',
        className,
      )}
    />
  );
});
FullNameInput.displayName = 'FullNameInput';

const FirstNameInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <FullNameInput
      ref={ref}
      roudedSide="left"
      className={className}
      placeholder="First name"
      {...props}
    />
  );
});
FirstNameInput.displayName = 'FirstNameInput';

const LastNameInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <FullNameInput
      ref={ref}
      roudedSide="right"
      className={className}
      placeholder="Last name"
      {...props}
    />
  );
});
LastNameInput.displayName = 'LastNameInput';

const FullName = Object.assign(FullNameRoot, {
  Input: FullNameInput,
  FirstName: FirstNameInput,
  LastName: LastNameInput,
});

export { FullName };
