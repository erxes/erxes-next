import { Combobox, Command, inputVariants, Popover } from 'erxes-ui/components';
import { Currency, CurrencyCode } from 'erxes-ui/types';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { cn } from 'erxes-ui/lib/utils';
import { IMaskInput } from 'react-imask';
import { Except } from 'type-fest';
import { IconChevronDown } from '@tabler/icons-react';

export const SelectCurrency = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Except<
    React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
    'onChange' | 'value'
  > & {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    value?: CurrencyCode;
    currencies?: Record<CurrencyCode, Currency>;
    display?: 'icon' | 'label' | 'code';
    onChange?: (value: CurrencyCode) => void;
  }
>(
  (
    {
      value,
      currencies = CURRENCY_CODES,
      className,
      display = 'label',
      onChange,
      open,
      setOpen,
      ...props
    },
    ref,
  ) => {
    const [_open, _setOpen] = useState(false);
    const selectedCurrency = value ? currencies[value] : undefined;

    return (
      <Popover modal open={open || _open} onOpenChange={setOpen || _setOpen}>
        <Combobox.Trigger
          className={className}
          onClick={(e) => e.stopPropagation()}
          ref={ref}
          {...props}
        >
          {selectedCurrency ? (
            <CurrencyDisplay code={value} variant={display} />
          ) : (
            <Combobox.Value placeholder="Select currency" />
          )}
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectCurrencyCommand
            currencies={currencies}
            value={value}
            onSelect={(code) => {
              onChange?.(code as CurrencyCode);
              setOpen?.(false);
              _setOpen(false);
            }}
          />
        </Combobox.Content>
      </Popover>
    );
  },
);

export const SelectCurrencyCommand = ({
  currencies = CURRENCY_CODES,
  value,
  onSelect,
  focusOnMount,
}: {
  currencies?: Record<CurrencyCode, Currency>;
  value?: CurrencyCode;
  onSelect: (code: CurrencyCode) => void;
  focusOnMount?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sortedCurrencies = Object.entries(currencies).sort((a, b) => {
    if (a[0] === value) {
      return -1;
    }
    return 1;
  });
  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus();
    }
  }, [focusOnMount]);
  return (
    <Command>
      <Command.Input placeholder="Search currency" ref={inputRef} />
      <Command.Separator />
      <Command.List>
        <Command.Empty>No currency found</Command.Empty>
        {sortedCurrencies.map(([code, { label, Icon }]) => (
          <Command.Item
            key={code}
            value={code + ' ' + label}
            onSelect={() => onSelect(code as CurrencyCode)}
          >
            <Icon />
            {label}
            <Combobox.Check checked={value === code} />
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};

export interface CurrencyDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Currency code to display */
  code?: CurrencyCode;
  variant?: 'icon' | 'label' | 'code';
}

/**
 * Displays a currency with its icon and optionally its label
 */
export const CurrencyDisplay = React.forwardRef<
  HTMLDivElement,
  CurrencyDisplayProps
>(({ code, variant = 'label', className, ...props }, ref) => {
  const currency = code ? CURRENCY_CODES[code] : undefined;
  const CurrencyIcon = currency?.Icon;

  if (variant === 'icon' && CurrencyIcon) {
    return <CurrencyIcon className="size-4" />;
  }

  if (variant === 'code' || variant === 'icon') {
    return <span className="text-muted-foreground mr-auto">{code}</span>;
  }

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {CurrencyIcon && <CurrencyIcon className="size-4" />}
      <span className="mr-auto">{currency?.label}</span>
    </div>
  );
});

CurrencyDisplay.displayName = 'CurrencyDisplay';

export const CurrencyValueInput = React.forwardRef<
  React.ElementRef<typeof IMaskInput>,
  Except<
    React.ComponentPropsWithoutRef<typeof IMaskInput>,
    'onChange' | 'value'
  > & {
    onChange: (value: number) => void;
    value: number;
  }
>(({ value, onChange, className, ...props }, ref) => {
  return (
    <IMaskInput
      ref={ref}
      mask={Number as any}
      thousandsSeparator={','}
      radix="."
      onAccept={(value) => onChange?.(Number(value))}
      value={value + ''}
      autoComplete="off"
      className={cn(inputVariants({ type: 'default' }), className)}
      unmask
      {...props}
    />
  );
});
