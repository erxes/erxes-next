import React from 'react';
import { Button } from './button';
import { cn } from '../lib/utils';
import { IconCheck, IconChevronDown, IconLoader } from '@tabler/icons-react';
import { TextOverflowTooltip } from './text-overflow';
import { Popover } from './popover';
import { Command } from './command';
import { useInView } from 'react-intersection-observer';
import { mergeRefs } from 'react-merge-refs';
import { Skeleton } from './skeleton';
import type { ApolloError } from '@apollo/client';
export const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    hideChevron?: boolean;
  }
>(({ className, children, hideChevron = false, ...props }, ref) => {
  return (
    <Popover.Trigger asChild>
      <Button
        ref={ref}
        role="combobox"
        variant="outline"
        {...props}
        type="button"
        className={cn(
          'truncate h-8 rounded px-3 shadow-xs focus-visible:shadow-focus focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:outline-transparent justify-between overflow-hidden font-semibold text-left',
          props.size === 'lg' && 'gap-2',
          className,
        )}
      >
        {children}
        {!hideChevron && (
          <IconChevronDown
            size={16}
            strokeWidth={2}
            className="flex-none opacity-50"
            aria-hidden="true"
          />
        )}
      </Button>
    </Popover.Trigger>
  );
});

ComboboxTrigger.displayName = 'ComboboxTrigger';

export const ComboboxValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof TextOverflowTooltip> & {
    className?: string;
    placeholder?: string;
  }
>(({ value, className, placeholder, ...props }, ref) => {
  return (
    <TextOverflowTooltip
      ref={ref}
      {...props}
      value={value || placeholder || ''}
      className={cn('text-left', !value && 'text-accent-foreground', className)}
    />
  );
});

ComboboxValue.displayName = 'ComboboxValue';

export const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentPropsWithoutRef<typeof Popover.Content>
>(({ className, ...props }, ref) => {
  return (
    <Popover.Content
      ref={ref}
      align="start"
      {...props}
      className={cn('p-0 min-w-[--radix-popper-anchor-width]', className)}
    />
  );
});

ComboboxContent.displayName = 'ComboboxContent';

export const ComboboxCheck = React.forwardRef<
  React.ElementRef<typeof IconCheck>,
  React.ComponentPropsWithoutRef<typeof IconCheck> & {
    checked?: boolean;
  }
>(({ className, checked, ...props }, ref) => {
  if (!checked) {
    return null;
  }

  return (
    <IconCheck
      ref={ref}
      size={16}
      strokeWidth={2}
      className={cn('size-4 text-muted-foreground ml-auto', className)}
      {...props}
    />
  );
});

ComboboxCheck.displayName = 'ComboboxCheck';

export const ComboboxFetchMore = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item> & {
    totalCount: number;
    currentLength: number;
    fetchMore: () => void;
  }
>(({ className, totalCount, currentLength, fetchMore, ...props }, ref) => {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && fetchMore(),
  });

  if (currentLength >= totalCount) {
    return null;
  }

  return (
    <Command.Item
      ref={mergeRefs([ref, bottomRef])}
      {...props}
      className={cn(className)}
    >
      <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-1" />
      Load more...
    </Command.Item>
  );
});

ComboboxFetchMore.displayName = 'ComboboxFetchMore';

const ComboboxEmpty = React.forwardRef<
  React.ElementRef<typeof Command.Empty>,
  React.ComponentPropsWithoutRef<typeof Command.Empty> & {
    loading?: boolean;
    error?: ApolloError;
  }
>(({ className, loading, error, ...props }, ref) => {
  return (
    <Command.Empty ref={ref} {...props} className={cn(className)}>
      {loading ? (
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className="w-2/3 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-2/3 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-32 h-4" />
        </div>
      ) : error ? (
        <p className="text-muted-foreground pb-2">{error.message}</p>
      ) : (
        <p className="text-muted-foreground pb-2">No results found.</p>
      )}
    </Command.Empty>
  );
});

export const Combobox = {
  Trigger: ComboboxTrigger,
  Value: ComboboxValue,
  Content: ComboboxContent,
  Check: ComboboxCheck,
  FetchMore: ComboboxFetchMore,
  Empty: ComboboxEmpty,
};
