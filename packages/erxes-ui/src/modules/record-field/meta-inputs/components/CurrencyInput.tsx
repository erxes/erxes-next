import { Input, inputVariants, Select } from 'erxes-ui/components';
import { SelectCurrency } from 'erxes-ui/components/currency/select-currency';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { cn } from 'erxes-ui/lib';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';
import { CurrencyCode } from 'erxes-ui/types';
import { IMaskInput } from 'react-imask';

export const CurrencyInput = () => {
  const { value, setValue } = useRecordTableCellContext();

  // Handle input change to preserve raw number value

  return (
    <div className="flex">
      <SelectCurrency currencies={CURRENCY_CODES} value={CurrencyCode.USD} />

      <IMaskInput
        mask={Number}
        thousandsSeparator={','}
        radix="."
        onAccept={(value) => setValue(Number(value))}
        value={value + ''}
        autoComplete="off"
        className={cn(
          inputVariants({ type: 'default' }),
          'rounded-none relative h-[34px]'
        )}
        unmask
      />
    </div>
  );
};
