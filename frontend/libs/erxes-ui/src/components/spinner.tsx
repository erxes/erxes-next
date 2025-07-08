import React from 'react';
import { cn } from 'erxes-ui/lib';
import { VariantProps, cva } from 'class-variance-authority';
import { IconLoader2 } from '@tabler/icons-react';

const spinnerVariants = cva(
  'flex-col items-center justify-center flex-auto h-full',
  {
    variants: {
      show: {
        true: 'flex',
        false: 'hidden',
      },
    },
    defaultVariants: {
      show: true,
    },
  },
);

const loaderVariants = cva('animate-spin', {
  variants: {
    size: {
      small: 'size-4',
      medium: 'size-5',
      large: 'size-6',
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
  containerClassName?: string;
}

export function Spinner({
  size,
  show,
  className,
  containerClassName,
}: SpinnerContentProps) {
  return (
    <span className={cn(spinnerVariants({ show }), containerClassName)}>
      <IconLoader2 className={cn(loaderVariants({ size }), className)} />
    </span>
  );
}
