import * as React from 'react';
import { cn } from '../lib/utils';
import { Sidebar } from './sidebar';
import { Separator } from './separator';

export type IHeaderProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Header = React.forwardRef<HTMLButtonElement, IHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        className={cn(
          'flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2 px-4">
          <Sidebar.Trigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {children}
        </div>
      </header>
    );
  }
);
Header.displayName = 'Header';
