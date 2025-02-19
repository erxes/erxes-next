import * as React from 'react';

import { cva } from 'class-variance-authority';

import { cn } from 'erxes-ui/lib/utils';

const inputVariants = cva(
  'flex h-8 w-full rounded-sm bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:shadow-focus',
  {
    variants: {
      type: {
        file: 'p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground',
        search:
          '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
        default: '',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  },
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            type:
              type === 'file'
                ? 'file'
                : type === 'search'
                ? 'search'
                : 'default',
          }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input, InputProps, inputVariants };
