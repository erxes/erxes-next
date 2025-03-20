import { Combobox, Command, inputVariants, Popover } from 'erxes-ui/components';
import { Currency, CurrencyCode } from 'erxes-ui/types';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { useState } from 'react';
import React from 'react';
import { cn } from 'erxes-ui/lib/utils';
import { IMaskInput } from 'react-imask';
import { Except } from 'type-fest';

export const SelectCurrency = ({
  value,
  currencies = CURRENCY_CODES,
  className,
  iconOnly = false,
  onChange,
  open,
  setOpen,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  value: CurrencyCode;
  currencies?: Record<CurrencyCode, Currency>;
  className?: string;
  iconOnly?: boolean;
  onChange?: (value: CurrencyCode) => void;
}) => {
  const [_open, _setOpen] = useState(false);
  const selectedCurrency = currencies[value];

  const sortedCurrencies = Object.entries(currencies).sort((a, b) => {
    if (a[0] === value) {
      return -1;
    }
    return 1;
  });

  return (
    <Popover modal open={open || _open} onOpenChange={setOpen || _setOpen}>
      <Combobox.Trigger
        variant="outline"
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedCurrency ? (
          <CurrencyDisplay code={value} iconOnly={iconOnly} />
        ) : (
          <Combobox.Value placeholder="Select currency" />
        )}
      </Combobox.Trigger>
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search currency" />
          <Command.List>
            <Command.Empty>No currency found</Command.Empty>
            {sortedCurrencies.map(([code, { label, Icon }]) => (
              <Command.Item
                key={code}
                value={code + ' ' + label}
                onSelect={() => {
                  onChange?.(code as CurrencyCode);
                  setOpen?.(false);
                  _setOpen(false);
                }}
              >
                <Icon />
                {label}
                <Combobox.Check checked={value === code} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};

export interface CurrencyDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Currency code to display */
  code: CurrencyCode;
  /** Whether to show only the currency icon without the label */
  iconOnly?: boolean;
}

/**
 * Displays a currency with its icon and optionally its label
 */
export const CurrencyDisplay = React.forwardRef<
  HTMLDivElement,
  CurrencyDisplayProps
>(({ code, iconOnly = false, className, ...props }, ref) => {
  const currency = CURRENCY_CODES[code];
  const CurrencyIcon = currency.Icon;

  if (iconOnly) {
    return <CurrencyIcon />;
  }

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <CurrencyIcon />
      <span className="mr-auto">{currency.label}</span>
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
