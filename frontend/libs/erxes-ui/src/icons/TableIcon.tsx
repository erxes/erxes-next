// import * as TablerIcons from '@tabler/icons-react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
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
// export type TablerIconNamesType = keyof typeof TablerIcons;

interface IconProps
  extends React.HtmlHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconVariants> {
  name: string;
}

const TablerIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ name, className, size, ...props }, ref) => {
    const IconComponent = name;

    if (!IconComponent) {
      // Return a default icon or null if the icon name is not found
      return null;
    }
    return <div className={cn(iconVariants({ className, size }))} />;
  },
);

TablerIcon.displayName = 'Icon';

export { TablerIcon, iconVariants };
