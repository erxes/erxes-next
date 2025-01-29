import * as React from 'react';

import { Separator } from './separator';
import { Sidebar } from './sidebar';
import { cn } from '../lib/utils';

export type IHeaderProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Header = React.forwardRef<HTMLButtonElement, IHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        className={cn(
          'flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4',
          className
        )}
        ref={ref}
        {...props}
      >
        <Sidebar.Trigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {children}
      </header>
    );
  }
);
Header.displayName = 'Header';
