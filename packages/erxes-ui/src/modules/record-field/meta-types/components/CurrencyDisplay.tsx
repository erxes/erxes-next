import { CurrencyDisplay } from 'erxes-ui/display';
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

const RecordFieldCurrencyDisplay = () => {
  const { getValue } = useRecordTableCellContext();
  console.log(getValue(), getValue, '--currency');
  return (
    <CurrencyDisplay
      currencyValue={{
        currencyCode: CurrencyCode.USD,
        amountMicros: getValue() * 1000000,
      }}
    />
  );
};

export default RecordFieldCurrencyDisplay;
