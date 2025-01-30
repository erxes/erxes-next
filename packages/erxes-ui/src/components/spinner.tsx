import React from 'react';

import { IconLoader } from '@tabler/icons-react';
import { cva,VariantProps } from 'class-variance-authority';

import { cn } from 'erxes-ui/lib';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      small: 'size-4',
      medium: 'size-6',
      large: 'size-10',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({ size, show, children, className }: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <IconLoader className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  );
}
