import { cn } from 'erxes-ui';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  totalCount: number | undefined;
  description: string;
  to: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Integration = React.forwardRef<HTMLButtonElement, Props>(
  ({ Icon, label, totalCount, description, to, ...rest }, ref) => {
    return (
      <Link to={{ pathname: '/setting/inbox/create', search: `?kind=${to}` }}>
        <button
          ref={ref}
          {...rest}
          className={cn(
            'relative flex flex-col items-start gap-2 p-3 shadow-xs rounded-lg border hover:bg-muted transition ease-linear duration-100 hover:scale-105 hover:shadow-sm h-full w-full',
            rest.className,
          )}
        >
          <span
            className={cn(
              totalCount && totalCount > 0
                ? 'text-primary'
                : 'text-muted-foreground',
              'absolute top-2 right-2 text-xs font-medium font-mono',
            )}
          >
            ({totalCount})
          </span>
          <div className="flex gap-2 items-center">
            <span className="flex items-center justify-center p-1.5 rounded-sm shadow-sm">
              <Icon className="w-5 h-5 text-white flex-shrink-0" />
            </span>
            <strong className="whitespace-break-spaces text-sm text-left line-clamp-2">
              {label}
            </strong>
          </div>

          <span className="text-sm text-muted-foreground text-left font-normal line-clamp-3 overflow-hidden leading-[140%]">
            {description}
          </span>
        </button>
      </Link>
    );
  },
);
