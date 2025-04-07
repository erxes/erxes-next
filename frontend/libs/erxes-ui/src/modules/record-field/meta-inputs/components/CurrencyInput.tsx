import {
  SelectCurrency,
  CurrencyValueInput,
} from 'erxes-ui/components/select-currency';
import { cn } from 'erxes-ui/lib';
import { CurrencyCode } from 'erxes-ui/types';

export const CurrencyInput = ({
  value,
  onChange,
  currencyCode,
  className,
  displayCurrency = 'code',
}: {
  value: number;
  onChange: (value: number) => void;
  currencyCode?: CurrencyCode;
  className?: string;
  displayCurrency?: 'icon' | 'label' | 'code';
}) => {
  return (
    <div
      className={cn(
        'flex shadow-xs h-auto items-stretch rounded gap-px bg-muted',
        className,
      )}
    >
      <SelectCurrency
        value={currencyCode || CurrencyCode.USD}
        className="rounded-none border-r-0 relative focus-visible:z-10 shadow-none border-transparent rounded-l flex-none pr-1 pl-2 gap-1"
        display={displayCurrency}
      />
      <CurrencyValueInput
        value={value}
        onChange={onChange}
        className="shadow-none border-none rounded-l-none focus-visible:z-10 focus-visible:relative"
      />
    </div>
  );
};
