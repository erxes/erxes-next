import { inputVariants, Separator } from 'erxes-ui/components';
import { SelectCurrency } from 'erxes-ui/components/select-currency';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { cn } from 'erxes-ui/lib';
import { CurrencyCode } from 'erxes-ui/types';
import { IMaskInput } from 'react-imask';

export const CurrencyInput = ({
  value,
  onChange,
  currencyCode,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  currencyCode?: CurrencyCode;
  className?: string;
}) => {
  return (
    <div
      className={cn('flex shadow-xs h-cell items-stretch rounded', className)}
    >
      <SelectCurrency
        currencies={CURRENCY_CODES}
        value={currencyCode || CurrencyCode.USD}
        className="h-full rounded-none border-r-0 relative focus-visible:z-10 shadow-none border-transparent rounded-l flex-none"
      />
      <Separator orientation="vertical" className="bg-muted" />
      <IMaskInput
        mask={Number}
        thousandsSeparator={','}
        radix="."
        onAccept={(value) => onChange(Number(value))}
        value={value + ''}
        autoComplete="off"
        className={cn(
          inputVariants({ type: 'default' }),
          'rounded-none relative h-full border-transparent rounded-r shadow-none',
        )}
        unmask
      />
    </div>
  );
};
