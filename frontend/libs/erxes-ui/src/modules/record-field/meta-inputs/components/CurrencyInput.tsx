import { inputVariants, Separator } from 'erxes-ui/components';
import { SelectCurrency } from 'erxes-ui/components/currency/select-currency';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { cn } from 'erxes-ui/lib';
import { CurrencyCode } from 'erxes-ui/types';
import { IMaskInput } from 'react-imask';

export const CurrencyInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex border border-border h-cell items-stretch">
      <SelectCurrency
        currencies={CURRENCY_CODES}
        value={CurrencyCode.USD}
        className="ring-0 shadow-none border-transparent h-full"
      />
      <Separator orientation="vertical" />
      <IMaskInput
        mask={Number}
        thousandsSeparator={','}
        radix="."
        onAccept={(value) => onChange(Number(value))}
        value={value + ''}
        autoComplete="off"
        className={cn(
          inputVariants({ type: 'default' }),
          'rounded-none relative h-full border-transparent',
        )}
        unmask
      />
    </div>
  );
};
