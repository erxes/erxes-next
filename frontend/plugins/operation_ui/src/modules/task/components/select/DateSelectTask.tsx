import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import {
  Calendar,
  RecordTableInlineCell,
  Combobox,
  PopoverScoped,
  Popover,
  Button,
  Form,
} from 'erxes-ui';
import { IconCalendarPlus, IconCalendarTime } from '@tabler/icons-react';
import { type ApolloError } from '@apollo/client';

export enum DateSelectVariant {
  TABLE = 'table',
  FILTER = 'filter',
  DETAIL = 'detail',
  CARD = 'card',
  FORM = 'form',
}

interface DateSelectContextType {
  value?: Date;
  onValueChange: (date?: Date) => void;
  loading?: boolean;
  error?: ApolloError;
  variant: DateSelectVariant;
}

const DateSelectContext = React.createContext<DateSelectContextType | null>(
  null,
);

const useDateSelectContext = () => {
  const context = React.useContext(DateSelectContext);
  if (!context) {
    throw new Error(
      'useDateSelectContext must be used within DateSelectProvider',
    );
  }
  return context;
};

const getDateColorClass = (date: Date): string => {
  const daysUntil = differenceInDays(date, new Date());

  if (daysUntil < 0) return 'text-red-500';
  if (daysUntil <= 3) return 'text-amber-500';
  if (daysUntil <= 7) return 'text-yellow-500';
  if (daysUntil <= 14) return 'text-blue-500';
  return 'text-green-500';
};

export const DateSelectProvider = ({
  children,
  ...props
}: DateSelectContextType & {
  children: React.ReactNode;
} & DateSelectContextType) => {
  return (
    <DateSelectContext.Provider
      value={{
        ...props,
      }}
    >
      {children}
    </DateSelectContext.Provider>
  );
};

const DateSelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = useDateSelectContext();

  if (!value) {
    return (
      <>
        <IconCalendarPlus className="text-accent-foreground" />
        <span className="text-accent-foreground font-medium">
          {placeholder || 'Select date...'}
        </span>
      </>
    );
  }

  return (
    <>
      <IconCalendarTime className={`size-4 ${getDateColorClass(value)}`} />
      {format(
        value,
        value.getFullYear() === new Date().getFullYear()
          ? 'MMM d'
          : 'MMM d, yyyy',
      )}
    </>
  );
};

const DateSelectContent = () => {
  const { value, onValueChange } = useDateSelectContext();

  return (
    <Calendar
      mode="single"
      selected={value}
      onSelect={onValueChange}
      defaultMonth={value}
    />
  );
};

export const DateSelectTrigger = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { variant } = useDateSelectContext();
  if (variant === DateSelectVariant.TABLE) {
    return (
      <RecordTableInlineCell.Trigger>{children}</RecordTableInlineCell.Trigger>
    );
  }
  if (variant === DateSelectVariant.CARD) {
    return (
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground font-semibold px-1"
          size="sm"
        >
          {children}
        </Button>
      </Popover.Trigger>
    );
  }
  return (
    <Combobox.TriggerBase className="w-fit h-7">
      {children}
    </Combobox.TriggerBase>
  );
};

export const DateSelectTaskRoot = ({
  value,
  id,
  type,
  scope,
  variant = DateSelectVariant.TABLE,
}: {
  value?: Date | string;
  id?: string;
  type: 'startDate' | 'targetDate';
  scope?: string;
  variant?: `${DateSelectVariant}`;
}) => {
  const [open, setOpen] = useState(false);
  const { updateTask, loading, error } = useUpdateTask();

  const handleValueChange = (value?: Date) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          [type]: value?.toISOString(),
        },
      });
    }
    setOpen(false);
  };

  const Content =
    variant === 'table' ? RecordTableInlineCell.Content : Combobox.Content;

  return (
    <DateSelectProvider
      value={value ? new Date(value) : undefined}
      onValueChange={handleValueChange}
      variant={variant as DateSelectVariant}
      loading={loading}
      error={error}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <DateSelectTrigger>
          <DateSelectValue placeholder="not specified" />
        </DateSelectTrigger>
        <Content className="w-fit">
          <DateSelectContent />
        </Content>
      </PopoverScoped>
    </DateSelectProvider>
  );
};

export const DateSelectTaskFormItem = ({
  value,
  onValueChange,
  placeholder,
}: {
  value?: Date | string;
  onValueChange?: (value?: Date) => void;
  placeholder?: string;
}) => {
  return (
    <DateSelectProvider
      value={value ? new Date(value) : undefined}
      onValueChange={(date) => onValueChange?.(date)}
      variant={DateSelectVariant.FORM}
    >
      <Popover>
        <Form.Control>
          <Combobox.TriggerBase className="w-fit h-7">
            <DateSelectValue placeholder={placeholder} />
          </Combobox.TriggerBase>
        </Form.Control>
        <Popover.Content className="w-fit">
          <DateSelectContent />
        </Popover.Content>
      </Popover>
    </DateSelectProvider>
  );
};

export const DateSelectTask = Object.assign(DateSelectTaskRoot, {
  Provider: DateSelectProvider,
  Value: DateSelectValue,
  Content: DateSelectContent,
  FormItem: DateSelectTaskFormItem,
});
