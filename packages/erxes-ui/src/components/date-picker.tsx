'use client';

import dayjs from 'dayjs';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Calendar, CalendarProps } from './calendar';
import { Popover } from './popover';
import React from 'react';

type DatePickerProps = {
  value: Date | Date[] | undefined;
  onChange: (date: Date | Date[] | undefined) => void;
  placeholder?: string;
  withPresent?: boolean;
  mode?: 'single' | 'multiple';
} & CalendarProps;

export const DatePicker = React.forwardRef<React.JSX.Element, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Pick a date',
      withPresent = false,
      disabled,
      className,
      mode = 'single',
      ...props
    },
    ref
  ) => {
    const renderButtonContent = () => {
      if (value) {
        if (mode === 'single') {
          return dayjs(new Date(value as Date)).format('YYYY/MM/DD');
        }

        if (mode === 'multiple' && Array.isArray(value)) {
          const selectedDays = value?.length;

          if (selectedDays) {
            return `${selectedDays} ${selectedDays > 1 ? 'Days' : 'Day'}`;
          }
        }
      }

      return placeholder;
    };

    const handleDateChange = (selectedDate: Date | Date[] | undefined) => {
      if (!selectedDate) {
        return;
      }

      onChange && onChange(selectedDate);
    };

    return (
      <Popover>
        <Popover.Trigger asChild={true}>
          <Button
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              !value && 'text-muted-foreground',
              Boolean(disabled) &&
                'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            disabled={Boolean(disabled)}
          >
            {renderButtonContent()}
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
            mode={mode}
            selected={value as any}
            onSelect={handleDateChange}
            initialFocus
          />
        </Popover.Content>
      </Popover>
    );
  }
);
