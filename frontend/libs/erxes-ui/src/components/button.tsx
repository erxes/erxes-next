import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'erxes-ui/lib';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-3 whitespace-nowrap rounded-md text-sm transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-medium',
  {
    variants: {
      variant: {
        default:
          'border-primary border relative transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transtion-opacity rounded-md shadow-button-primary before:pointer-events-none before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-b before:from-white/20 before:opacity-50 hover:before:opacity-100 bg-primary text-primary-foreground after:pointer-events-none after:absolute after:inset-0 after:bg-white/10 after:bottom-1/2 after:rounded-sm after:mix-blend-overlay [text-shadow:_0_1px_1px_rgb(0_0_0_/_25%)]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'shadow-sm bg-background shadow-button-outline hover:bg-accent ',
        secondary: 'bg-accent text-foreground hover:bg-border',
        ghost: 'hover:bg-accent',
        link: 'bg-background shadow-button-outline hover:bg-accent text-primary',
      },
      size: {
        default: 'h-7 py-1',
        sm: 'h-6 rounded text-xs after:rounded-[2px] after:absolute',
        lg: 'h-8 rounded-md px-6 font-semibold',
        icon: 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        type="button"
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
