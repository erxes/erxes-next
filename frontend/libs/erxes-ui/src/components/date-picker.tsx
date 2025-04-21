import React from 'react';

import dayjs from 'dayjs';

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
          return dayjs(new Date(value as Date)).format('MMM DD, YYYY');
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
      <div
        className="w-96 h-96 px-10 rounded-2xl relative flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg,rgba(215, 215, 215, 1) 0%, rgba(244, 211, 94, 1) 20%, rgba(238, 150, 75, 1) 38%, rgba(249, 87, 148, 1) 55%, rgba(157, 78, 221, 1) 79%, rgba(0, 187, 249, 1) 100%)`,
        }}
      >
        <div className="absolute inset-0 rounded-2xl backdrop-blur bg-white/10 border border-white/20 shadow-lg -z-10" />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild={true}>
            <Combobox.Trigger
              variant={'outline'}
              disabled={Boolean(disabled)}
              className={cn(
                !value && 'text-muted-foreground',
                Boolean(disabled) && 'cursor-not-allowed opacity-50',
                className,
              )}
            >
              {renderButtonContent()}
            </Combobox.Trigger>
          </Popover.Trigger>
          <Popover.Content className="w-auto p-0">
            <Calendar
              {...props}
              disabled={(date: Date) =>
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
      </div>
    );
  },
);
