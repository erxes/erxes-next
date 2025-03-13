'use client';

import React from 'react';

import dayjs from 'dayjs';

import { Button } from './button';
import { Calendar, CalendarProps } from './calendar';
import { Popover } from './popover';
import { cn } from '../lib/utils';
import { Combobox } from './combobox';

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
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
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

      setIsOpen(false);
      onChange && onChange(selectedDate);
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild={true}>
          <Combobox
            variant={'outline'}
            disabled={Boolean(disabled)}
            className={cn(
              !value && 'text-muted-foreground',
              Boolean(disabled) && 'cursor-not-allowed opacity-50',
              className,
            )}
          >
            {renderButtonContent()}
          </Combobox>
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
  },
);
