import { cva, type VariantProps } from 'class-variance-authority';
import React, { ComponentType, SVGProps, lazy, Suspense } from 'react';
import { cn } from 'erxes-ui/lib';

const iconVariants = cva(``, {
  variants: {
    size: {
      default: '',
      xsm: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type TablerIconSize = 'xsm' | 'sm' | 'md' | 'lg' | 'xl';

interface IconProps
  extends React.HtmlHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconVariants> {
  name: string;
}

function loadIcon(name: string) {
  return lazy(() =>
    import('@tabler/icons-react').then((module) => {
      const Icon = module[name as keyof typeof module] as ComponentType<
        SVGProps<SVGSVGElement>
      >;

      if (!Icon) {
        throw new Error(
          `Icon "${name}" does not exist in @tabler/icons-react.`,
        );
      }

      return { default: Icon };
    }),
  );
}

const DynamicTablerIcon = ({ name }: { name: string }) => {
  const LazyIcon = loadIcon(name);

  return (
    <Suspense fallback={<span className="w-4 h-4 animate-pulse" />}>
      <LazyIcon />
    </Suspense>
  );
};

const TablerIcon = React.forwardRef<SVGElement, IconProps>(
  ({ name, className, size, ...props }, ref) => {
    return (
      <span
        ref={ref as any}
        className={cn(iconVariants({ size }), className)}
        {...props}
      >
        <DynamicTablerIcon name={name} />
      </span>
    );
  },
);

TablerIcon.displayName = 'Icon';

export { TablerIcon, iconVariants };
