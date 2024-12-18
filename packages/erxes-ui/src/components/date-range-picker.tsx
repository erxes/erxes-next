'use client';

import dayjs from 'dayjs';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Calendar, CalendarProps } from './calendar';
import { Popover } from './popover';
import React from 'react';
import { DateRange } from 'react-day-picker';

type DateRangePickerProps = {
  value: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
  placeholder?: string;
  withPresent?: boolean;
} & CalendarProps;

export const DateRangePicker = React.forwardRef<
  React.JSX.Element,
  DateRangePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      withPresent = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const { from, to } = value || {};

    const renderButton = () => {
      const dates: string[] = [];

      if (from) {
        dates.push(dayjs(from).format('YYYY/MM/DD'));
      }

      if (to) {
        dates.push(dayjs(to).format('YYYY/MM/DD'));
      }

      if (from && to) {
        return <span>{dates.join(' - ')}</span>;
      }

      if (placeholder) {
        return <span>{placeholder}</span>;
      }

      return <span>Pick a date range</span>;
    };

    const handleDateChange = (selectedDate: DateRange | undefined) => {
      if (!selectedDate) {
        return;
      }

      onChange && onChange({ from: selectedDate.from, to: selectedDate.to });
    };

    return (
      <Popover>
        <Popover.Trigger asChild={true}>
          <Button
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              Boolean(disabled) &&
                'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            disabled={Boolean(disabled)}
          >
            {renderButton()}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-auto p-0">
          <Calendar
            {...props}
            disabled={(date) =>
              withPresent
                ? date > new Date() || date < new Date('1900-01-01')
                : Boolean(disabled)
            }
            mode={'range'}
            selected={value}
            onSelect={handleDateChange}
            initialFocus
          />
        </Popover.Content>
      </Popover>
    );
  }
);
