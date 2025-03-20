import { Separator } from 'erxes-ui/components';
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
        value={currencyCode || CurrencyCode.USD}
        className="h-full rounded-none border-r-0 relative focus-visible:z-10 shadow-none border-transparent rounded-l flex-none"
      />
      <Separator orientation="vertical" className="bg-muted" />
      <CurrencyValueInput value={value} onChange={onChange} />
    </div>
  );
};
