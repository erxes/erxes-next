import { CurrencyDisplay } from 'erxes-ui/display';
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

const RecordFieldCurrencyDisplay = () => {
  const { value } = useRecordTableCellContext();
  return (
    <CurrencyDisplay
      currencyValue={{
        currencyCode: CurrencyCode.USD,
        amountMicros: value * 1000000,
      }}
    />
  );
};

export default RecordFieldCurrencyDisplay;
